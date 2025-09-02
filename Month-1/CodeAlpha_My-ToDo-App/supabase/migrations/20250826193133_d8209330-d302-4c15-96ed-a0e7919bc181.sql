-- Temporarily drop the problematic trigger to allow status updates
DROP TRIGGER IF EXISTS todo_status_change_trigger ON public.todos;

-- Drop the function that's causing the net schema error
DROP FUNCTION IF EXISTS public.notify_status_change() CASCADE;

-- Create a simpler version that doesn't use net.http_post for now
-- We'll re-enable email notifications once the net extension is properly configured
CREATE OR REPLACE FUNCTION public.notify_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- For now, just log the change without sending emails
  -- This ensures status updates work while we fix the email functionality
  RAISE NOTICE 'Todo status changed from % to % for todo %', OLD.status, NEW.status, NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Recreate the trigger (optional for now since it just logs)
-- CREATE TRIGGER todo_status_change_trigger
--   AFTER UPDATE ON public.todos
--   FOR EACH ROW
--   EXECUTE FUNCTION public.notify_status_change();