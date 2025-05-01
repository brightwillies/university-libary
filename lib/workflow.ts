import {Client as WorkflowClient} from "@upstash/workflow";
import config from "@/lib/config";
import { Client as QStashClient, resend } from "@upstash/qstash";

export const workflowClient = new WorkflowClient({
    baseUrl: config.env.upstash.qstashUrl,
    token: config.env.upstash.qstashToken,
  });
  
  const qstashClient = new QStashClient({
    token: config.env.upstash.qstashToken,
  });
  