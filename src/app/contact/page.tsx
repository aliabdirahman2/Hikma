export default function ContactPage() {
    return (
        <div className="container mx-auto max-w-3xl py-12 px-4 min-h-[calc(100vh-20rem)]">
            <h1 className="font-headline text-4xl text-primary mb-6">Contact Us</h1>
            <p className="text-lg text-muted-foreground mb-6">Have questions, feedback, or concerns about SeekHikma? We'd love to hear from you.</p>
            
            <div className="bg-muted/30 p-8 rounded-lg border border-primary/20 text-center">
                <p className="text-muted-foreground mb-4">You can reach out directly via email at:</p>
                <a href="mailto:aliabdirahman248@gmail.com" className="font-headline text-2xl text-primary hover:underline">
                    aliabdirahman248@gmail.com
                </a>
            </div>
        </div>
    );
}
