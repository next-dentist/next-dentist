import Image from 'next/image';

export default function FounderPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8 flex flex-col items-center md:flex-row md:items-start md:space-x-8">
        {/* Photo Portrait Space */}
        <div className="mb-6 flex-shrink-0 md:mb-0">
          <Image
            src="/images/company/dr-megha-vyas.jpg"
            alt="Dr. Megha Vyas Portrait"
            width={200}
            height={200}
            className="rounded-full border-4 border-blue-100 object-cover shadow-lg"
            priority // Load this image with high priority as it's above the fold
          />
        </div>
        {/* Title and initial introductory text */}
        <div>
          <h1 className="mb-4 text-center text-3xl font-bold md:text-left md:text-4xl">
            Founder: Dr. Megha Vyas, BDS, MDS (Oral & Maxillofacial Surgery)
          </h1>
          <p className="mb-4 text-lg">
            At the heart of NextDentist is the pioneering vision of Dr. Megha
            Vyas—a dedicated Oral & Maxillofacial Surgery Specialist, an
            advocate for accessible dental care, and a passionate leader shaping
            the future of dentistry through innovation, compassion, and
            collaboration.
          </p>
        </div>
      </div>

      {/* Remaining content */}
      <p className="mb-4">
        With over a decade of hands-on clinical experience and academic
        excellence, Dr. Vyas recognized a critical gap in the way patients
        access dental services and the support systems available to dental
        professionals. Her mission became clear: to build a seamless,
        tech-driven platform that not only connects patients with trusted dental
        professionals around the world but also empowers dentists with modern
        digital tools, continuous learning opportunities, and business growth
        solutions tailored to their unique needs.
      </p>
      <p className="mb-4">
        Dr. Vyas has worked across diverse geographies and patient
        communities—from urban centers to underserved rural populations—giving
        her a unique perspective on the challenges, disparities, and
        inequalities that persist in global dental care. Her deep empathy for
        patients and firsthand understanding of a clinician’s challenges
        inspired the foundation of NextDentist. Her vision is grounded in
        creating equal opportunities for oral healthcare access and fostering
        professional growth for dentists.
      </p>
      <p className="mb-4">
        NextDentist was created as a response to fragmented, outdated systems
        that often left patients confused and providers unsupported. Under Dr.
        Vyas's leadership, the platform has evolved into more than just a
        dentist directory; it is a global movement advocating for equitable,
        transparent, and patient-centric dental care. Through advanced search
        capabilities, verified practitioner profiles, appointment scheduling,
        and lead generation tools, NextDentist supports both sides of the dental
        care equation.
      </p>
      <p className="mb-4">
        Her unwavering commitment to quality, trust, and technology has
        transformed NextDentist into a trusted partner for dental practitioners
        and a reliable guide for patients. Dr. Vyas also champions the
        integration of telehealth and AI in dentistry, paving the way for a
        future where accessibility and preventative care take precedence. She
        believes in empowering dental professionals through visibility,
        resources, and a community of shared excellence.
      </p>
      <div className="mt-10 border-l-4 border-blue-500 bg-blue-50 p-6">
        <p className="italic">
          "I started NextDentist with a simple but powerful idea: that everyone
          deserves access to trusted dental care, no matter where they are. We
          are building a global community where patients feel safe, informed,
          and confident in their dental choices, and where dentists are
          supported not just as clinicians, but as innovators, educators, and
          entrepreneurs. Together, we're reshaping the future of oral health—one
          connection at a time."
        </p>
        <p className="mt-4 text-right font-semibold">- Dr. Megha Vyas</p>
      </div>
      <p className="mt-8 text-center text-lg font-bold italic">
        Driven by care. Empowered by technology. Guided by trust. Inspired by
        people.
      </p>
    </div>
  );
}
