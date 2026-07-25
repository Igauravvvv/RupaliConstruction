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
        "group/card flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center justify-between rounded-2xl border border-[var(--rc-border)]",
        "bg-white shadow-sm",
        "p-6 md:p-8",
        "hover:bg-[var(--rc-orange)] hover:border-[var(--rc-orange)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300",
        "w-[350px] sm:w-[450px] md:w-[700px] lg:w-[850px] max-w-[90vw] shrink-0 cursor-pointer",
        className
      )}
    >
      <div className="flex-1">
        <p className="mb-0 text-base md:text-lg font-serif italic font-medium text-[var(--rc-dark)] leading-relaxed group-hover/card:text-white transition-colors">
          "{text}"
        </p>
      </div>
      <div className="flex items-center gap-4 shrink-0 md:w-[220px] md:border-l border-[var(--rc-border)] md:pl-8 group-hover/card:border-white/30 transition-colors">
        <Avatar className="h-12 w-12 border border-[var(--rc-border)] group-hover/card:border-white/30 transition-colors">
          <AvatarImage src={author.avatar} alt={author.name} />
        </Avatar>
        <div className="flex flex-col items-start">
          <h3 className="text-base font-bold text-[var(--rc-dark)] leading-tight group-hover/card:text-white transition-colors">
            {author.name}
          </h3>
          <p className="text-xs font-medium text-[var(--rc-orange)] uppercase tracking-wider group-hover/card:text-white/90 transition-colors">
            {author.handle}
          </p>
        </div>
      </div>
    </Card>
  )
}
