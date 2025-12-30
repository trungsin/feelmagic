"use client";

import { Template } from "@prisma/client";
import { NamesEditor } from "./names-editor";
import { MessageEditor } from "./message-editor";
import { BackgroundPicker } from "./background-picker";
import { MusicSelector } from "./music-selector";
import { EffectsPanel } from "./effects-panel";
import { VoiceTriggersEditor } from "./voice-triggers";
import { GestureTriggersEditor } from "./gesture-triggers";
import { PublishPanel } from "./publish-panel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BuilderSidebarProps {
  template: Template;
}

export function BuilderSidebar({ template }: BuilderSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <NamesEditor />
          <MessageEditor />
        </CardContent>
      </Card>

      {/* Customization */}
      <Card>
        <CardHeader>
          <CardTitle>Customization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <BackgroundPicker />
          <MusicSelector availableMusic={template.availableMusic} />
        </CardContent>
      </Card>

      {/* AR Effects */}
      <Card>
        <CardHeader>
          <CardTitle>AR Effects</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <EffectsPanel availableEffects={template.availableEffects} />
          <VoiceTriggersEditor />
          <GestureTriggersEditor />
        </CardContent>
      </Card>

      {/* Publish */}
      <PublishPanel />
    </div>
  );
}
