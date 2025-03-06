import { APP_NAME } from "@/app/consts";

export const metadata = {
  title: "Terms of Service",
  description: `Read the Terms of Service for ${APP_NAME} to understand the rules, guidelines, and agreements for using our platform and services.`,
};

export default function TermsOfService() {
  return (
    <div className="mx-auto py-8 px-4 md:px-0">
      <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
        <p className="mb-4">
          Welcome to Supavec. These Terms of Service (&ldquo;Terms&rdquo;)
          govern your access to and use of the Supavec platform, website, APIs,
          and services (collectively, the &ldquo;Service&rdquo;). Please read
          these Terms carefully before using our Service.
        </p>
        <p className="mb-4">
          By accessing or using the Service, you agree to be bound by these
          Terms. If you do not agree to these Terms, you may not access or use
          the Service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">2. Definitions</h2>
        <ul className="list-disc pl-8 mb-4">
          <li className="mb-2">
            <strong>&ldquo;Supavec&rdquo;</strong>,{" "}
            <strong>&ldquo;we&rdquo;</strong>, <strong>&ldquo;us&rdquo;</strong>
            , or <strong>&ldquo;our&rdquo;</strong> refers to Supavec, the
            provider of the Service.
          </li>
          <li className="mb-2">
            <strong>&ldquo;You&rdquo;</strong> or{" "}
            <strong>&ldquo;your&rdquo;</strong> refers to the individual or
            entity using the Service.
          </li>
          <li className="mb-2">
            <strong>&ldquo;Content&rdquo;</strong> refers to any data, text,
            files, information, or materials that you upload, process, or store
            through the Service.
          </li>
          <li className="mb-2">
            <strong>&ldquo;RAG&rdquo;</strong> refers to Retrieval-Augmented
            Generation, the AI technology used in our Service.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">3. Account Registration</h2>

        <h3 className="text-xl font-semibold mb-3">3.1 Account Creation</h3>
        <p className="mb-4">
          To use certain features of the Service, you must register for an
          account. You agree to provide accurate, current, and complete
          information during the registration process and to update such
          information to keep it accurate, current, and complete.
        </p>

        <h3 className="text-xl font-semibold mb-3">3.2 Account Security</h3>
        <p className="mb-4">
          You are responsible for safeguarding the password and access
          credentials to your account. You agree not to disclose your password
          or access credentials to any third party and to take sole
          responsibility for any activities or actions under your account,
          whether or not you have authorized such activities or actions.
        </p>

        <h3 className="text-xl font-semibold mb-3">3.3 Age Requirement</h3>
        <p className="mb-4">
          The Service is not intended for individuals under the age of 18. By
          creating an account, you represent that you are at least 18 years old.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">4. Service Description</h2>

        <h3 className="text-xl font-semibold mb-3">4.1 RAG Platform</h3>
        <p className="mb-4">
          Supavec is an open-source Retrieval-Augmented Generation (RAG)
          platform that helps developers integrate AI with their data. Users can
          upload documents via API and query them using natural language.
        </p>

        <h3 className="text-xl font-semibold mb-3">
          4.2 Open Source and Self-Hosting
        </h3>
        <p className="mb-4">
          Our core technology is available as open source software under the MIT
          license. You may use the open-source version for self-hosting
          according to the terms of the MIT license.
        </p>

        <h3 className="text-xl font-semibold mb-3">4.3 Cloud Service</h3>
        <p className="mb-4">
          We also offer a cloud-hosted version of the Service that provides
          additional features and capabilities beyond the open-source version.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">5. Pricing and Payment</h2>

        <h3 className="text-xl font-semibold mb-3">5.1 Free Tier</h3>
        <p className="mb-4">
          We offer a free tier with limited features and usage caps.
        </p>

        <h3 className="text-xl font-semibold mb-3">5.2 Paid Subscriptions</h3>
        <p className="mb-4">
          Paid subscription plans are available with additional features and
          higher usage limits. Pricing is available on our website or upon
          request.
        </p>

        <h3 className="text-xl font-semibold mb-3">5.3 Payment Terms</h3>
        <p className="mb-4">
          You agree to pay all applicable fees for the Service you select. All
          payments are non-refundable except as expressly set forth in these
          Terms. We reserve the right to change our prices upon reasonable
          notice.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">6. Your Content</h2>

        <h3 className="text-xl font-semibold mb-3">
          6.1 Ownership of Your Content
        </h3>
        <p className="mb-4">
          You retain all rights to your Content. By uploading Content to the
          Service, you grant Supavec a worldwide, non-exclusive, royalty-free
          license to use, copy, store, transmit, and process your Content solely
          to the extent necessary to provide and maintain the Service.
        </p>

        <h3 className="text-xl font-semibold mb-3">6.2 Content Restrictions</h3>
        <p className="mb-4">You agree not to upload Content that:</p>
        <ul className="list-disc pl-8 mb-4">
          <li>Infringes on the intellectual property rights of others</li>
          <li>Violates any applicable laws or regulations</li>
          <li>Contains harmful code, malware, or viruses</li>
          <li>
            Contains personal data in violation of applicable privacy laws
          </li>
          <li>Is unlawful, defamatory, obscene, or otherwise objectionable</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">6.3 Content Removal</h3>
        <p className="mb-4">
          We reserve the right to remove or disable access to any Content that
          violates these Terms or is otherwise objectionable.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">
          7. Intellectual Property Rights
        </h2>

        <h3 className="text-xl font-semibold mb-3">
          7.1 Supavec Intellectual Property
        </h3>
        <p className="mb-4">
          The Service and its original content (excluding your Content),
          features, and functionality are owned by Supavec and are protected by
          international copyright, trademark, patent, trade secret, and other
          intellectual property laws.
        </p>

        <h3 className="text-xl font-semibold mb-3">7.2 Open Source Software</h3>
        <p className="mb-4">
          Portions of our software are available under the MIT license, the
          terms of which are available at{" "}
          <a
            href="https://opensource.org/licenses/MIT"
            className="text-blue-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://opensource.org/licenses/MIT
          </a>
          .
        </p>

        <h3 className="text-xl font-semibold mb-3">7.3 Feedback</h3>
        <p className="mb-4">
          If you provide us with feedback about the Service, you grant us a
          perpetual, irrevocable, worldwide, royalty-free license to use that
          feedback for any purpose, including to improve the Service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">8. Acceptable Use</h2>

        <h3 className="text-xl font-semibold mb-3">8.1 General Conduct</h3>
        <p className="mb-4">
          You agree to use the Service only for lawful purposes and in
          accordance with these Terms. You agree not to:
        </p>
        <ul className="list-disc pl-8 mb-4">
          <li>
            Use the Service in any way that violates any applicable law or
            regulation
          </li>
          <li>
            Use the Service to harm, threaten, or harass any person or to
            promote discrimination, racism, or harm
          </li>
          <li>
            Interfere with or disrupt the Service or servers or networks
            connected to the Service
          </li>
          <li>
            Attempt to gain unauthorized access to any part of the Service
          </li>
          <li>
            Use the Service to generate, transmit, or store sensitive personal
            information without appropriate safeguards
          </li>
          <li>
            Use the Service to develop or train competing products or services
          </li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">8.2 API Rate Limits</h3>
        <p className="mb-4">
          You agree to respect any rate limits and other technical measures we
          implement to ensure the stability and availability of the Service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">9. Third-Party Services</h2>

        <h3 className="text-xl font-semibold mb-3">
          9.1 Integration with Third-Party Services
        </h3>
        <p className="mb-4">
          The Service may integrate with or allow access to third-party
          services. Your use of these third-party services is governed by their
          respective terms of service and privacy policies.
        </p>

        <h3 className="text-xl font-semibold mb-3">9.2 Third-Party Links</h3>
        <p className="mb-4">
          The Service may contain links to third-party websites or resources
          that are not owned or controlled by Supavec. We are not responsible
          for the content or availability of such external sites or resources.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">
          10. Disclaimer of Warranties
        </h2>
        <p className="mb-4 uppercase">
          THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS
          AVAILABLE&rdquo; WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR
          IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF
          MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR
          NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE
          UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">11. Limitation of Liability</h2>
        <p className="mb-4 uppercase">
          IN NO EVENT SHALL SUPAVEC, ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS,
          SUPPLIERS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
          SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT
          LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE
          LOSSES, RESULTING FROM:
        </p>
        <ul className="list-disc pl-8 mb-4 uppercase">
          <li>
            YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICE
          </li>
          <li>ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE SERVICE</li>
          <li>ANY CONTENT OBTAINED FROM THE SERVICE</li>
          <li>
            UNAUTHORIZED ACCESS, USE, OR ALTERATION OF YOUR TRANSMISSIONS OR
            CONTENT
          </li>
        </ul>
        <p className="mb-4 uppercase">
          IN NO EVENT SHALL OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS EXCEED THE
          AMOUNT PAID BY YOU, IF ANY, FOR ACCESSING OR USING THE SERVICE DURING
          THE TWELVE (12) MONTHS PRECEDING THE CLAIM.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">12. Indemnification</h2>
        <p className="mb-4">
          You agree to defend, indemnify, and hold harmless Supavec and its
          licensors, service providers, and their respective officers,
          directors, employees, contractors, agents, licensors, suppliers,
          successors, and assigns from and against any claims, liabilities,
          damages, judgments, awards, losses, costs, expenses, or fees
          (including reasonable attorneys&apos; fees) arising out of or relating
          to your violation of these Terms or your use of the Service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">13. Term and Termination</h2>

        <h3 className="text-xl font-semibold mb-3">13.1 Term</h3>
        <p className="mb-4">
          These Terms will remain in full force and effect while you use the
          Service.
        </p>

        <h3 className="text-xl font-semibold mb-3">13.2 Termination by You</h3>
        <p className="mb-4">
          You may terminate your account at any time by contacting us at{" "}
          <a
            href="mailto:hello@supavec.com"
            className="text-blue-600 hover:underline"
          >
            hello@supavec.com
          </a>
          .
        </p>

        <h3 className="text-xl font-semibold mb-3">13.3 Termination by Us</h3>
        <p className="mb-4">
          We may terminate or suspend your account and access to the Service
          immediately, without prior notice or liability, for any reason,
          including if you breach these Terms.
        </p>

        <h3 className="text-xl font-semibold mb-3">
          13.4 Effect of Termination
        </h3>
        <p className="mb-4">
          Upon termination, your right to use the Service will immediately
          cease. All provisions of these Terms which by their nature should
          survive termination shall survive, including ownership provisions,
          warranty disclaimers, indemnification, and limitations of liability.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">
          14. Modifications to the Service
        </h2>
        <p className="mb-4">
          We reserve the right to modify or discontinue, temporarily or
          permanently, the Service (or any part thereof) with or without notice.
          We shall not be liable to you or to any third party for any
          modification, suspension, or discontinuance of the Service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">
          15. Modifications to the Terms
        </h2>
        <p className="mb-4">
          We reserve the right to modify these Terms at any time. We will
          provide notice of significant changes to these Terms by posting the
          revised Terms on our website. Your continued use of the Service after
          such changes constitutes your acceptance of the new Terms.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">
          16. Governing Law and Dispute Resolution
        </h2>

        <h3 className="text-xl font-semibold mb-3">16.1 Governing Law</h3>
        <p className="mb-4">
          These Terms shall be governed by and construed in accordance with the
          laws of the State of Delaware, without regard to its conflict of law
          provisions.
        </p>

        <h3 className="text-xl font-semibold mb-3">16.2 Dispute Resolution</h3>
        <p className="mb-4">
          Any dispute arising from or relating to these Terms or the Service
          shall be resolved through binding arbitration in accordance with the
          American Arbitration Association&apos;s rules. The arbitration shall
          be conducted in English and shall take place in Delaware. Judgment on
          the award rendered by the arbitrator may be entered in any court
          having jurisdiction.
        </p>

        <h3 className="text-xl font-semibold mb-3">
          16.3 Waiver of Class Actions
        </h3>
        <p className="mb-4 uppercase">
          ANY PROCEEDINGS TO RESOLVE OR LITIGATE ANY DISPUTE IN ANY FORUM WILL
          BE CONDUCTED SOLELY ON AN INDIVIDUAL BASIS. NEITHER YOU NOR WE WILL
          SEEK TO HAVE ANY DISPUTE HEARD AS A CLASS ACTION OR IN ANY OTHER
          PROCEEDING IN WHICH EITHER PARTY ACTS OR PROPOSES TO ACT IN A
          REPRESENTATIVE CAPACITY.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">17. General Provisions</h2>

        <h3 className="text-xl font-semibold mb-3">17.1 Entire Agreement</h3>
        <p className="mb-4">
          These Terms constitute the entire agreement between you and Supavec
          regarding the Service and supersede all prior agreements and
          understandings.
        </p>

        <h3 className="text-xl font-semibold mb-3">17.2 Waiver</h3>
        <p className="mb-4">
          No waiver of any term of these Terms shall be deemed a further or
          continuing waiver of such term or any other term.
        </p>

        <h3 className="text-xl font-semibold mb-3">17.3 Severability</h3>
        <p className="mb-4">
          If any provision of these Terms is held to be invalid or
          unenforceable, such provision shall be struck and the remaining
          provisions shall be enforced.
        </p>

        <h3 className="text-xl font-semibold mb-3">17.4 Assignment</h3>
        <p className="mb-4">
          You may not assign or transfer these Terms or your rights under these
          Terms without our prior written consent. We may assign or transfer
          these Terms without your consent.
        </p>

        <h3 className="text-xl font-semibold mb-3">17.5 Force Majeure</h3>
        <p className="mb-4">
          We will not be liable for any failure or delay in performing our
          obligations where such failure or delay results from any cause beyond
          our reasonable control.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">18. Contact Information</h2>
        <p className="mb-4">
          If you have any questions about these Terms, please contact us:
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
              target="_blank"
              rel="noopener noreferrer"
            >
              https://go.supavec.com/discord
            </a>
          </li>
        </ul>
      </section>

      <p className="text-center text-muted-foreground">
        By using {APP_NAME}, you acknowledge that you have read, understood, and
        agree to be bound by these Terms of Service.
      </p>
    </div>
  );
}
