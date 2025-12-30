"use client";

import { useBuilder } from "./builder-provider";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function MessageEditor() {
  const { customization, updateCustomization } = useBuilder();

  return (
    <div className="space-y-2">
      <Label htmlFor="message">
        Your Message
        <span className="text-xs text-muted-foreground ml-2">
          ({customization.message.length}/500)
        </span>
      </Label>
      <Textarea
        id="message"
        placeholder="Write your heartfelt Valentine's message here..."
        value={customization.message}
        onChange={(e) => {
          const value = e.target.value.slice(0, 500);
          updateCustomization({ message: value });
        }}
        maxLength={500}
        rows={6}
        className="resize-none"
      />
      <p className="text-xs text-muted-foreground">
        This message will appear in the AR card when viewed.
      </p>
    </div>
  );
}
