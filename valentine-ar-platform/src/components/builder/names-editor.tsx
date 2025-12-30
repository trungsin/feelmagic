"use client";

import { useBuilder } from "./builder-provider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function NamesEditor() {
  const { customization, updateCustomization } = useBuilder();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="recipientName">
          Recipient Name
          <span className="text-xs text-muted-foreground ml-2">
            ({customization.recipientName.length}/50)
          </span>
        </Label>
        <Input
          id="recipientName"
          placeholder="e.g., Sarah"
          value={customization.recipientName}
          onChange={(e) => {
            const value = e.target.value.slice(0, 50);
            updateCustomization({ recipientName: value });
          }}
          maxLength={50}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="senderName">
          Your Name
          <span className="text-xs text-muted-foreground ml-2">
            ({customization.senderName.length}/50)
          </span>
        </Label>
        <Input
          id="senderName"
          placeholder="e.g., John"
          value={customization.senderName}
          onChange={(e) => {
            const value = e.target.value.slice(0, 50);
            updateCustomization({ senderName: value });
          }}
          maxLength={50}
        />
      </div>
    </div>
  );
}
