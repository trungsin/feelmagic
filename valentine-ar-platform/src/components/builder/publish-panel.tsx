"use client";

import { useState } from "react";
import { useBuilder } from "./builder-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Share2, Copy, Check, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function PublishPanel() {
  const { cardId, customization, saveCard } = useBuilder();
  const { toast } = useToast();

  const [isPublished, setIsPublished] = useState(false);
  const [expiryDate, setExpiryDate] = useState("");
  const [shareableLink, setShareableLink] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handlePublish = async () => {
    if (!cardId) return;

    // Validate required fields
    if (!customization.recipientName.trim()) {
      toast({
        title: "Missing recipient name",
        description: "Please enter a recipient name before publishing.",
        variant: "destructive",
      });
      return;
    }

    if (!customization.senderName.trim()) {
      toast({
        title: "Missing sender name",
        description: "Please enter your name before publishing.",
        variant: "destructive",
      });
      return;
    }

    if (!customization.message.trim()) {
      toast({
        title: "Missing message",
        description: "Please write a message before publishing.",
        variant: "destructive",
      });
      return;
    }

    setIsPublishing(true);

    try {
      // First save current changes
      await saveCard();

      // Then publish
      const response = await fetch("/api/builder/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardId,
          isPublished: true,
          expiresAt: expiryDate ? new Date(expiryDate).toISOString() : null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to publish card");
      }

      const data = await response.json();
      setIsPublished(true);
      setShareableLink(data.shareableLink);

      toast({
        title: "Card published!",
        description: "Your card is now live and ready to share.",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to publish card";
      toast({
        title: "Publish failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleUnpublish = async () => {
    if (!cardId) return;

    setIsPublishing(true);

    try {
      const response = await fetch("/api/builder/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardId,
          isPublished: false,
          expiresAt: null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to unpublish card");
      }

      setIsPublished(false);
      setShareableLink("");

      toast({
        title: "Card unpublished",
        description: "Your card is no longer publicly accessible.",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to unpublish card";
      toast({
        title: "Unpublish failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const copyToClipboard = async () => {
    if (!shareableLink) return;

    try {
      await navigator.clipboard.writeText(shareableLink);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "The shareable link has been copied to your clipboard.",
      });

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Failed to copy link to clipboard.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          Publish & Share
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6 space-y-4">
        {!isPublished ? (
          <>
            {/* Expiry date (optional) */}
            <div className="space-y-2">
              <Label htmlFor="expiryDate">
                Expiry Date (Optional)
              </Label>
              <Input
                id="expiryDate"
                type="datetime-local"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
              />
              <p className="text-xs text-muted-foreground">
                Leave empty for no expiration
              </p>
            </div>

            {/* Publish button */}
            <Button
              onClick={handlePublish}
              disabled={isPublishing}
              className="w-full"
              size="lg"
            >
              {isPublishing ? "Publishing..." : "Publish Card"}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Once published, you&apos;ll receive a shareable link
            </p>
          </>
        ) : (
          <>
            {/* Published state */}
            <div className="p-4 rounded-lg bg-green-50 border border-green-200">
              <p className="text-sm font-medium text-green-900 mb-2">
                ✅ Card is published!
              </p>
              <p className="text-xs text-green-700">
                Your card is live and ready to be shared with your loved one.
              </p>
            </div>

            {/* Shareable link */}
            {shareableLink && (
              <div className="space-y-2">
                <Label>Shareable Link</Label>
                <div className="flex gap-2">
                  <Input
                    value={shareableLink}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={copyToClipboard}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    asChild
                  >
                    <a href={shareableLink} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            )}

            {/* Unpublish button */}
            <Button
              onClick={handleUnpublish}
              disabled={isPublishing}
              variant="outline"
              className="w-full"
            >
              {isPublishing ? "Unpublishing..." : "Unpublish Card"}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
