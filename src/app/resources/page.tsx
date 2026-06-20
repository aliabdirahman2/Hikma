export default function ResourcesPage() {
    return (
        <div className="container mx-auto max-w-3xl py-12 px-4 min-h-[calc(100vh-20rem)]">
            <h1 className="font-headline text-4xl text-primary mb-6">Resources</h1>
            <p className="text-lg text-muted-foreground mb-8">Curated knowledge to help you along your journey of psychological and spiritual reflection.</p>
            
            <div className="space-y-6">
                <div className="bg-card p-6 rounded-lg border border-primary/20 shadow-sm hover:shadow-md transition-shadow">
                    <h2 className="font-headline text-2xl text-card-foreground mb-2">The Four Temperaments in Islamic Cosmology</h2>
                    <p className="text-muted-foreground mb-4">An insightful lecture by Sheikh Hamza Yusuf exploring the ancient roots and spiritual significance of the four temperament theory.</p>
                    <a 
                        href="https://youtu.be/X0rIOcaFnFY?si=H8xZtJQwuZHS1vP2" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-medium inline-flex items-center gap-1"
                    >
                        Watch on YouTube
                    </a>
                </div>
            </div>
        </div>
    );
}
