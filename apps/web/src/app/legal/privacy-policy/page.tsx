import { APP_NAME } from "@/app/consts";

export const metadata = {
  title: "Privacy Policy",
  description: `Learn how ${APP_NAME} collects, uses, and protects your personal information and data when using our services.`,
};

export default function PrivacyPolicy() {
  return (
    <div className="mx-auto py-8 px-4 md:px-0">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Introduction</h2>
        <p className="mb-4">
          Welcome to Supavec (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or
          &ldquo;us&rdquo;). We are committed to protecting your privacy and
          handling your data with transparency and care. This Privacy Policy
          explains how we collect, use, disclose, and safeguard your information
          when you use our platform, website (https://www.supavec.com), and
          related services (collectively, the &ldquo;Service&rdquo;).
        </p>
        <p className="mb-4">
          By accessing or using the Service, you agree to this Privacy Policy.
          If you do not agree with our policies and practices, please do not use
          our Service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Information We Collect</h2>

        <h3 className="text-xl font-semibold mb-3">Personal Information</h3>
        <p className="mb-4">
          We may collect personal information that you voluntarily provide to us
          when you:
        </p>
        <ul className="list-disc pl-8 mb-4">
          <li>Register for an account</li>
          <li>Use our services</li>
          <li>Contact our support team</li>
          <li>Subscribe to our newsletter</li>
          <li>Participate in surveys or promotions</li>
        </ul>

        <p className="mb-4">This information may include:</p>
        <ul className="list-disc pl-8 mb-4">
          <li>Name</li>
          <li>Email address</li>
          <li>Job title and company name</li>
          <li>Account credentials</li>
          <li>Payment information</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">Usage Data</h3>
        <p className="mb-4">
          We automatically collect certain information when you visit, use, or
          navigate our Service. This information may include:
        </p>
        <ul className="list-disc pl-8 mb-4">
          <li>IP address</li>
          <li>Browser type and version</li>
          <li>Device type</li>
          <li>Operating system</li>
          <li>Pages visited</li>
          <li>Time and date of your visit</li>
          <li>Time spent on pages</li>
          <li>Referring URLs</li>
          <li>Other diagnostic data</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">
          Data From Files You Upload
        </h3>
        <p className="mb-4">When you upload files to our Service:</p>
        <ul className="list-disc pl-8 mb-4">
          <li>
            We process and store the content of your files to provide RAG
            (Retrieval-Augmented Generation) services
          </li>
          <li>
            We generate and store embeddings created from your file content
          </li>
          <li>
            We maintain records of file metadata (filename, upload date, size,
            etc.)
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">How We Use Your Information</h2>
        <p className="mb-4">
          We use your information for various purposes, including to:
        </p>
        <ul className="list-disc pl-8 mb-4">
          <li>Provide, maintain, and improve our Service</li>
          <li>Process transactions and handle payments</li>
          <li>Respond to your inquiries and provide customer support</li>
          <li>Send administrative information and updates about our Service</li>
          <li>
            Send marketing and promotional communications (with your consent)
          </li>
          <li>Monitor usage patterns and analyze trends</li>
          <li>Protect against malicious, deceptive, or illegal activity</li>
          <li>Debug and fix issues with our Service</li>
          <li>Comply with legal obligations</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Data Retention</h2>
        <p className="mb-4">
          We store your personal information and uploaded files for as long as
          your account is active or as needed to provide you with our Service.
          We may retain certain information as required by law or for legitimate
          business purposes.
        </p>
        <p className="mb-4">
          You can request deletion of your account and associated data at any
          time by contacting us at hello@supavec.com.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Data Security</h2>
        <p className="mb-4">
          We implement appropriate technical and organizational measures to
          protect your personal information from unauthorized access,
          alteration, disclosure, or destruction. However, no method of
          transmission over the Internet or electronic storage is 100% secure,
          so we cannot guarantee absolute security.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Sharing Your Information</h2>

        <h3 className="text-xl font-semibold mb-3">Service Providers</h3>
        <p className="mb-4">
          We may share your information with third-party vendors, service
          providers, and other partners who work on our behalf to help us
          provide and improve our Service. These parties are obligated to keep
          your information confidential and secure.
        </p>

        <h3 className="text-xl font-semibold mb-3">Business Transfers</h3>
        <p className="mb-4">
          If we are involved in a merger, acquisition, or sale of all or a
          portion of our assets, your information may be transferred as part of
          that transaction.
        </p>

        <h3 className="text-xl font-semibold mb-3">Legal Requirements</h3>
        <p className="mb-4">
          We may disclose your information if required to do so by law or in
          response to valid requests by public authorities (e.g., a court or
          government agency).
        </p>

        <h3 className="text-xl font-semibold mb-3">With Your Consent</h3>
        <p className="mb-4">
          We may share your information for other purposes with your consent.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Third-Party Services</h2>
        <p className="mb-4">
          Our Service may contain links to third-party websites, services, or
          applications that are not operated by us. We have no control over and
          assume no responsibility for the content, privacy policies, or
          practices of any third-party services.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">
          Data Processing Subprocessors
        </h2>
        <p className="mb-4">
          We use the following subprocessors to help provide our Service:
        </p>
        <ul className="list-disc pl-8 mb-4">
          <li>Supabase: For database hosting and storage</li>
          <li>Upstash: For rate limiting and queue management</li>
          <li>OpenAI: For generating embeddings and AI responses</li>
          <li>PostHog: For analytics</li>
          <li>Loops: For customer engagement and email communications</li>
          <li>Stripe: For payment processing</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
        <p className="mb-4">
          Depending on your location, you may have certain rights regarding your
          personal information, including:
        </p>
        <ul className="list-disc pl-8 mb-4">
          <li>
            The right to access and receive a copy of your personal information
          </li>
          <li>The right to correct inaccurate or incomplete information</li>
          <li>The right to delete your personal information</li>
          <li>
            The right to restrict or object to processing of your personal
            information
          </li>
          <li>The right to data portability</li>
          <li>The right to withdraw consent</li>
        </ul>
        <p className="mb-4">
          To exercise these rights, please contact us at hello@supavec.com.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Children&apos;s Privacy</h2>
        <p className="mb-4">
          Our Service is not intended for individuals under the age of 18. We do
          not knowingly collect personal information from children. If you are a
          parent or guardian and believe your child has provided us with
          personal information, please contact us.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">
          International Data Transfers
        </h2>
        <p className="mb-4">
          Your information may be transferred to and processed in countries
          other than the country in which you reside. These countries may have
          data protection laws that differ from those in your country.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">
          Changes to This Privacy Policy
        </h2>
        <p className="mb-4">
          We may update this Privacy Policy from time to time. We will notify
          you of material changes by posting the updated Privacy Policy on this
          page. We encourage you to review this Privacy Policy periodically.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">California Privacy Rights</h2>
        <p className="mb-4">
          If you are a California resident, you have specific rights regarding
          your personal information under the California Consumer Privacy Act
          (CCPA). Please contact us for more information about your California
          privacy rights.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
        <p className="mb-4">
          If you have any questions about this Privacy Policy or our data
          practices, please contact us:
        </p>
        <ul className="list-disc pl-8 mb-4">
          <li>
            By email:{" "}
            <a
              href="mailto:hello@supavec.com"
              className="text-blue-600 hover:underline"
            >
              hello@supavec.com
            </a>
          </li>
          <li>
            Through our Discord community:{" "}
            <a
              href="https://go.supavec.com/discord"
              className="text-blue-600 hover:underline"
            >
              https://go.supavec.com/discord
            </a>
          </li>
        </ul>
      </section>

      <p className="text-center text-muted-foreground">
        Thank you for trusting {APP_NAME} with your data.
      </p>
    </div>
  );
}
