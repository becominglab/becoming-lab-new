"use client";

import { usePushNotification } from "@/hooks/usePushNotification";

interface Props {
  userId?: string;
}

export default function PushNotificationRegistrar({ userId }: Props) {
  usePushNotification(userId);
  return null;
}
