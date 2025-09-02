import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// Create Supabase client for server operations
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface StatusUpdateRequest {
  todo_id: string;
  old_status: string;
  new_status: string;
  title: string;
  user_id: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return '#f59e0b';
    case 'ongoing': return '#3b82f6';
    case 'completed': return '#10b981';
    default: return '#6b7280';
  }
};

const getStatusEmoji = (status: string) => {
  switch (status) {
    case 'pending': return '⏳';
    case 'ongoing': return '🔄';
    case 'completed': return '✅';
    default: return '📝';
  }
};

const handler = async (req: Request): Promise<Response> => {
  console.log('Status update email function called');

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { todo_id, old_status, new_status, title, user_id }: StatusUpdateRequest = await req.json();
    
    console.log('Processing status update:', { todo_id, old_status, new_status, title, user_id });

    // Get user email from auth.users table using service role
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(user_id);
    
    if (userError || !userData.user?.email) {
      console.error('Error getting user email:', userError);
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const userEmail = userData.user.email;
    const statusEmoji = getStatusEmoji(new_status);
    const statusColor = getStatusColor(new_status);

    const emailResponse = await resend.emails.send({
      from: "My TO DO <onboarding@resend.dev>",
      to: [userEmail],
      subject: `${statusEmoji} Task Status Updated: ${title}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="display: inline-block; width: 60px; height: 60px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
              <span style="font-size: 24px; color: white;">📝</span>
            </div>
            <h1 style="color: #1f2937; margin: 0; font-size: 28px; font-weight: bold;">Task Status Updated</h1>
          </div>

          <div style="background-color: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 24px; border-left: 4px solid ${statusColor};">
            <h2 style="color: #1f2937; margin: 0 0 12px 0; font-size: 20px; font-weight: 600;">${title}</h2>
            
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
              <span style="color: #6b7280; font-size: 14px;">Status changed from:</span>
              <span style="background-color: #e5e7eb; color: #374151; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; text-transform: capitalize;">
                ${old_status}
              </span>
              <span style="color: #6b7280;">→</span>
              <span style="background-color: ${statusColor}; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; text-transform: capitalize;">
                ${statusEmoji} ${new_status}
              </span>
            </div>
          </div>

          <div style="background-color: #f0f9ff; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
            <p style="color: #0369a1; margin: 0; font-size: 14px;">
              ${new_status === 'completed' 
                ? '🎉 Congratulations on completing this task! Keep up the great work!' 
                : new_status === 'ongoing' 
                ? '🚀 Great! You\'re making progress on this task.' 
                : '📋 This task is now pending and ready to be started.'}
            </p>
          </div>

          <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 12px; margin: 0;">
              This email was sent from My TO DO task management system.
            </p>
          </div>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-status-update-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);