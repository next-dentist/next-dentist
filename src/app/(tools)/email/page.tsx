"use client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEmailSend } from "@/hooks/useEmailSend";
import React, { useState } from "react";

const EmailPage = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [templateId, setTemplateId] = useState("");

  const { sendEmail, isLoading, error, data } = useEmailSend();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await sendEmail({
        email,
        name,
        template_id: templateId,
      });
    } catch (err) {
      console.error("Error sending email:", err);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Send Email</CardTitle>
        </CardHeader>
        <CardContent>
          {data && (
            <Alert className="mb-4">
              <AlertDescription>{data.message}</AlertDescription>
            </Alert>
          )}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="recipient@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Recipient Name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="templateId">Template ID</Label>
              <Input
                type="text"
                id="templateId"
                value={templateId}
                onChange={(e) => setTemplateId(e.target.value)}
                required
                placeholder="Template ID"
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Sending..." : "Send Email"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailPage;
