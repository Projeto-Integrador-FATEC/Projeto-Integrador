"use client";

import Link from "next/link";
import { FormEvent, KeyboardEvent, ReactNode, useEffect, useRef, useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { ChatTurn } from "@/models/chat.model";

const SUGGESTIONS = [
  "Quais cursos de programação vocês têm?",
  "Tem algum curso para iniciante?",
  "Quem oferece o curso de Java?",
];

export function CourseChat() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatTurn[]>([]);

  async function send(content: string) {
    const question = content.trim();

    if (!question || pending) {
      return;
    }

    const nextMessages: ChatTurn[] = [...messages, { role: "user", content: question }];
    setMessages(nextMessages);
    setDraft("");
    setError(null);
    setPending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error ?? "Erro ao consultar o assistente");
      }

      setMessages((current) => [...current, { role: "assistant", content: data.reply }]);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao consultar o assistente";
      setError(message);
      toast.error(message);
    } finally {
      setPending(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <CourseChatTrigger />
      <CourseChatPanel
        messages={messages}
        draft={draft}
        pending={pending}
        error={error}
        onDraftChange={setDraft}
        onSend={send}
      />
    </Sheet>
  );
}

function CourseChatTrigger() {
  return (
    <SheetTrigger asChild>
      <Button className="fixed right-6 bottom-6 shadow-lg">
        <MessageCircle data-icon="inline-start" />
        Perguntar sobre cursos
      </Button>
    </SheetTrigger>
  );
}

function CourseChatPanel({
  messages,
  draft,
  pending,
  error,
  onDraftChange,
  onSend,
}: {
  messages: ChatTurn[];
  draft: string;
  pending: boolean;
  error: string | null;
  onDraftChange: (value: string) => void;
  onSend: (content: string) => void;
}) {
  return (
    <SheetContent className="h-full w-full gap-0 p-0 sm:max-w-md">
      <SheetHeader className="pr-10">
        <SheetTitle>Assistente de cursos</SheetTitle>
        <SheetDescription>Pergunte sobre os cursos cadastrados na plataforma.</SheetDescription>
      </SheetHeader>
      <Separator />
      <CourseChatTranscript messages={messages} pending={pending} error={error} onSuggest={onSend} />
      <Separator />
      <CourseChatComposer draft={draft} pending={pending} onDraftChange={onDraftChange} onSend={onSend} />
    </SheetContent>
  );
}

function CourseChatTranscript({
  messages,
  pending,
  error,
  onSuggest,
}: {
  messages: ChatTurn[];
  pending: boolean;
  error: string | null;
  onSuggest: (content: string) => void;
}) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages, pending, error]);

  return (
    <ScrollArea className="min-h-0 flex-1 px-4">
      <div className="flex flex-col gap-3 py-4">
        {messages.length === 0 ? <CourseChatSuggestions disabled={pending} onSuggest={onSuggest} /> : null}
        {messages.map((message, index) => (
          <CourseChatMessage key={`${message.role}-${index}`} message={message} />
        ))}
        {pending ? <p className="text-muted-foreground text-sm">Consultando os cursos...</p> : null}
        {error ? <p className="text-destructive text-sm">{error}</p> : null}
        <div ref={endRef} />
      </div>
    </ScrollArea>
  );
}

function CourseChatSuggestions({
  disabled,
  onSuggest,
}: {
  disabled: boolean;
  onSuggest: (content: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-muted-foreground text-sm">Escolha uma pergunta ou escreva a sua.</p>
      {SUGGESTIONS.map((suggestion) => (
        <Button
          key={suggestion}
          type="button"
          variant="outline"
          className="h-auto justify-start py-2 text-left whitespace-normal"
          disabled={disabled}
          onClick={() => onSuggest(suggestion)}
        >
          {suggestion}
        </Button>
      ))}
    </div>
  );
}

function CourseChatMessage({ message }: { message: ChatTurn }) {
  const own = message.role === "user";

  return (
    <div className={own ? "flex justify-end" : "flex justify-start"}>
      <div
        className={
          own
            ? "bg-primary text-primary-foreground max-w-[85%] rounded-lg px-3 py-2 text-sm"
            : "bg-muted max-w-[85%] rounded-lg px-3 py-2 text-sm"
        }
      >
        {own ? <p className="whitespace-pre-wrap">{message.content}</p> : <ChatMarkdown text={message.content} />}
      </div>
    </div>
  );
}

function CourseChatComposer({
  draft,
  pending,
  onDraftChange,
  onSend,
}: {
  draft: string;
  pending: boolean;
  onDraftChange: (value: string) => void;
  onSend: (content: string) => void;
}) {
  function submit(event: FormEvent) {
    event.preventDefault();
    onSend(draft);
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSend(draft);
    }
  }

  return (
    <form className="flex items-end gap-2 p-4" onSubmit={submit}>
      <Textarea
        value={draft}
        placeholder="Ex.: tem curso de Java para iniciante?"
        disabled={pending}
        rows={2}
        onChange={(event) => onDraftChange(event.target.value)}
        onKeyDown={onKeyDown}
      />
      <Button type="submit" size="icon" disabled={pending || draft.trim().length === 0} aria-label="Enviar pergunta">
        <Send />
      </Button>
    </form>
  );
}

const markdownComponents: Components = {
  a: ChatMarkdownLink,
  p: ({ children }) => <p>{children}</p>,
  ul: ({ children }) => <ul className="flex list-disc flex-col gap-1 pl-4">{children}</ul>,
  ol: ({ children }) => <ol className="flex list-decimal flex-col gap-1 pl-4">{children}</ol>,
  li: ({ children }) => <li>{children}</li>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  h1: ({ children }) => <p className="font-semibold">{children}</p>,
  h2: ({ children }) => <p className="font-semibold">{children}</p>,
  h3: ({ children }) => <p className="font-semibold">{children}</p>,
  pre: ({ children }) => <pre className="overflow-x-auto rounded-md bg-background p-2">{children}</pre>,
  code: ({ children }) => <code className="rounded bg-background px-1">{children}</code>,
  table: ({ children }) => (
    <div className="overflow-x-auto">
      <table className="w-full">{children}</table>
    </div>
  ),
  th: ({ children }) => <th className="px-2 py-1 text-left font-semibold">{children}</th>,
  td: ({ children }) => <td className="px-2 py-1 align-top">{children}</td>,
};

function ChatMarkdown({ text }: { text: string }) {
  return (
    <div className="flex flex-col gap-2 break-words">
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} components={markdownComponents}>
        {withCourseLinks(text)}
      </ReactMarkdown>
    </div>
  );
}

function withCourseLinks(text: string): string {
  return text.replace(/(?<!\]\()\/curso-details\/(\d+)/g, "[ver curso](/curso-details/$1)");
}

function ChatMarkdownLink({ href, children }: { href?: string; children?: ReactNode }) {
  if (href?.startsWith("/curso-details/")) {
    return (
      <Link href={href} className="underline whitespace-nowrap">
        {children}
      </Link>
    );
  }

  if (href?.startsWith("https://") || href?.startsWith("http://")) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className="underline">
        {children}
      </a>
    );
  }

  return <span>{children}</span>;
}
