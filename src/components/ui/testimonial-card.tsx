import { cn } from "@/lib/utils"
import { Avatar, AvatarImage } from "@/components/ui/avatar"

export interface TestimonialAuthor {
  name: string
  handle: string
  avatar: string
}

export interface TestimonialCardProps {
  author: TestimonialAuthor
  text: string
  href?: string
  className?: string
}

export function TestimonialCard({ 
  author,
  text,
  href,
  className
}: TestimonialCardProps) {
  const Card = href ? 'a' : 'div'
  
  return (
    <Card
      {...(href ? { href } : {})}
      className={cn(
        "flex flex-col justify-between rounded-2xl border border-[var(--rc-border)]",
        "bg-white shadow-sm",
        "p-6 sm:p-8",
        "hover:shadow-md transition-shadow duration-300",
        "w-[600px] max-w-[90vw] shrink-0", // Forces a wide, horizontal rectangle shape
        className
      )}
    >
      <p className="mb-8 text-xl md:text-2xl font-serif italic font-bold text-[var(--rc-dark)] leading-snug">
        "{text}"
      </p>
      <div className="flex items-center gap-4 mt-auto">
        <Avatar className="h-12 w-12 border border-[var(--rc-border)]">
          <AvatarImage src={author.avatar} alt={author.name} />
        </Avatar>
        <div className="flex flex-col items-start">
          <h3 className="text-base font-bold text-[var(--rc-dark)] leading-tight">
            {author.name}
          </h3>
          <p className="text-xs font-medium text-[var(--rc-orange)] uppercase tracking-wider">
            {author.handle}
          </p>
        </div>
      </div>
    </Card>
  )
}
