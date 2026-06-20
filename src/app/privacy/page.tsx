export default function PrivacyPolicyPage() {
    return (
        <div className="container mx-auto max-w-3xl py-12 px-4 min-h-[calc(100vh-20rem)]">
            <h1 className="font-headline text-4xl text-primary mb-6">Privacy Policy</h1>
            <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p>At SeekHikma, we treat your psychological and spiritual reflections as sacred trusts. This page outlines how your data is used and protected.</p>
                
                <h2 className="font-headline text-2xl text-primary mt-8">How We Use Your Data</h2>
                <p>We use the data you share with us (such as journal entries and test results) solely to best serve you and create a personalized map of your temperament and psychological landscape. This information helps the AI guide you towards deeper inner harmony and better understanding of others.</p>
                
                <h2 className="font-headline text-2xl text-primary mt-8">External APIs and AI Models</h2>
                <p>While we use advanced AI models to process your reflections, <strong>any information given to external APIs does not stay with them</strong>. We ensure that zero-retention policies are enforced with our LLM providers, meaning your data is processed for immediate insight and immediately discarded by the provider. It is not used to train external models.</p>

                <h2 className="font-headline text-2xl text-primary mt-8">How We Keep Your Data Safe</h2>
                <p>On our end, we employ industry-standard encryption to secure your data both in transit and at rest in our database. We restrict access strictly to the systems required to serve you your own insights. We do not sell, rent, or share your personal data with third-party advertisers.</p>
            </div>
        </div>
    );
}
