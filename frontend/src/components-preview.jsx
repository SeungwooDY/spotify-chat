import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { User } from "lucide-react";
import "./App.css";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const Section = ({ title, children }) => (
  <section className="mb-10">
    <h2 className="mb-1 text-xs font-semibold uppercase tracking-widest text-[#5F6368]">
      {title}
    </h2>
    <div className="mb-4 h-px bg-[#D9D9D9]" />
    {children}
  </section>
);

const Label = ({ children }) => (
  <p className="mb-2 text-xs text-[#5F6368]">{children}</p>
);

const ComponentPreview = () => {
  const [toggled, setToggled] = useState(false);
  const [text, setText] = useState("Editable bio text...");

  return (
    <div className="min-h-screen bg-[#F4F2EA] px-16 py-12">
      <h1 className="mb-1 text-3xl font-bold text-[#0F1F2F]">
        Component Preview
      </h1>
      <p className="mb-12 text-sm text-[#5F6368]">
        Import from{" "}
        <code className="rounded bg-white px-1.5 py-0.5 text-[#0F1F2F]">
          @/components/ui
        </code>
      </p>

      <Section title="Avatar">
        <div className="flex items-end gap-6">
          <div className="flex flex-col items-center gap-1">
            <Avatar className="h-12 w-12 border border-[#202124] bg-[#D9D9D9]">
              <AvatarImage src="" />
              <AvatarFallback className="bg-[#D9D9D9]">
                <User className="h-6 w-6 text-[#202124]" strokeWidth={2.5} />
              </AvatarFallback>
            </Avatar>
            <Label>small</Label>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Avatar className="h-20 w-20 border border-[#202124] bg-[#D9D9D9]">
              <AvatarImage src="" />
              <AvatarFallback className="bg-[#D9D9D9]">
                <User className="h-10 w-10 text-[#202124]" strokeWidth={2.5} />
              </AvatarFallback>
            </Avatar>
            <Label>large (profile page)</Label>
          </div>
        </div>
      </Section>

      <Section title="Button">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex flex-col items-center gap-1">
            <Button className="bg-[#4B8DB3] text-white hover:bg-[#4B8DB3]/90">
              Save Changes
            </Button>
            <Label>filled</Label>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="border-[#6EA3D5] text-[#6EA3D5]"
            >
              Edit Photo
            </Button>
            <Label>outline</Label>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Button
              size="sm"
              className="rounded-full bg-[#4B8DB3] text-xs text-white hover:bg-[#4B8DB3]/90"
            >
              View top artists
            </Button>
            <Label>pill</Label>
          </div>
        </div>
      </Section>

      <Section title="Card">
        <Card className="max-w-sm">
          <CardContent className="p-5">
            <h3 className="text-lg font-semibold text-[#0F1F2F]">
              Featured artists
            </h3>
            <p className="mt-1 text-sm text-[#5F6368]">
              Pick from your top artists
            </p>
          </CardContent>
        </Card>
      </Section>

      <Section title="Switch">
        <div className="flex items-center gap-3">
          <Switch checked={toggled} onCheckedChange={setToggled} />
          <span className="text-sm text-[#0F1F2F]">
            {toggled ? "Public" : "Private"}
          </span>
        </div>
      </Section>

      <Section title="Textarea">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="max-w-sm resize-none bg-white text-sm text-[#0F1F2F] shadow-none focus-visible:ring-0 border-none"
        />
      </Section>
    </div>
  );
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ComponentPreview />
  </StrictMode>
);
