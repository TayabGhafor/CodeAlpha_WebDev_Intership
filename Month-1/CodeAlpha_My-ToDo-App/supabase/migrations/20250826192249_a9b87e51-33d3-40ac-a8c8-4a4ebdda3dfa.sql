-- Create a trigger function to send email notifications when todo status changes
CREATE OR REPLACE FUNCTION public.notify_status_change()
RETURNS TRIGGER AS $$
DECLARE
  user_email text;
BEGIN
  -- Only proceed if status actually changed
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    -- Get user email from auth.users table via RPC call
    -- Since we can't directly query auth.users, we'll use the profiles table
    -- and make the edge function get the email from auth
    
    -- Call the edge function to send email notification
    PERFORM
      net.http_post(
        url := 'https://zvyaaxwaqqcefjdkjnyb.supabase.co/functions/v1/send-status-update-email',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || current_setting('app.jwt_token', true)
        ),
        body := jsonb_build_object(
          'todo_id', NEW.id::text,
          'old_status', COALESCE(OLD.status, 'unknown'),
          'new_status', NEW.status,
          'title', NEW.title,
          'user_id', NEW.user_id::text
        )
      );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS todo_status_change_trigger ON public.todos;
CREATE TRIGGER todo_status_change_trigger
  AFTER UPDATE ON public.todos
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_status_change();