'use client';

interface DirectorsDeskProps {}

const DirectorsDesk: React.FC<DirectorsDeskProps> = () => {
  return (
    <section className="min-h-screen bg-[#f4f8f8]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 md:py-12">
        {/* Header Section */}
        <header className="mb-10 text-center sm:mb-14">
          <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-[#356574] sm:text-4xl md:text-5xl">
            Director&apos;s Desk
          </h1>
          <div className="mx-auto h-1 w-16 rounded-full bg-[#356574] sm:w-24"></div>
        </header>

        {/* Director Section */}
        <article className="mb-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl sm:mb-12 sm:rounded-3xl sm:p-8 md:p-12">
          <div className="flex flex-col items-center gap-8 sm:gap-10 md:gap-12 lg:flex-row lg:items-start">
            {/* Portrait Section */}
            <figure className="mb-6 flex-shrink-0 lg:mb-0">
              <div className="group relative flex items-center justify-center">
                <div className="absolute -inset-2 rounded-full bg-[#356574] opacity-20 blur transition-opacity group-hover:opacity-30 sm:-inset-4"></div>
                <div className="relative">
                  <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-full border-8 border-white bg-gray-200 shadow-xl sm:h-52 sm:w-52">
                    {/* Director photo */}
                    <img
                      src="/images/company/dr-megha-vyas.jpg"
                      alt="Dr. Megha Vyas"
                      className="h-full w-full rounded-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  {/* Professional badge */}
                  <figcaption className="absolute -right-2 -bottom-2 rounded-full bg-[#356574] px-3 py-1.5 text-xs font-semibold text-white shadow-lg sm:text-sm">
                    Director
                  </figcaption>
                </div>
              </div>
            </figure>

            {/* Content Section */}
            <div className="w-full flex-1">
              <div className="mb-6 sm:mb-8">
                <h2 className="mb-3 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
                  Message from the Director
                </h2>
                <div className="h-1 w-12 rounded-full bg-[#356574] sm:w-16"></div>
              </div>

              <div className="space-y-5 text-base leading-relaxed text-gray-700 sm:space-y-6 sm:text-lg">
                <p className="first-letter:float-left first-letter:mt-1 first-letter:mr-3 first-letter:text-4xl first-letter:font-bold first-letter:text-[#356574] sm:first-letter:text-5xl">
                  At NextDentist, we believe in connecting innovation with
                  accessibility to transform how dental professionals engage
                  with patients and opportunities. As the Director, I am proud
                  to guide this platform with a vision centered on quality,
                  trust, and forward-thinking growth.
                </p>
                <p>
                  My journey in the field of dentistry began in 2005, and over
                  the years, I specialized in oral and faciomaxillary surgery.
                  This path was inspired by a commitment to serve every needy
                  patient with the best possible care. I have always believed
                  that timely and affordable treatment should be a right, not a
                  privilege.
                </p>
                <p>
                  This belief led to the creation of NextDentist—an online
                  platform designed to help patients connect with the right
                  dental professionals based on location, timing, and
                  affordability. It is a solution born from firsthand experience
                  and a relentless drive to make quality dental care accessible
                  for all.
                </p>
                <p>
                  With the dental landscape rapidly evolving through technology
                  and patient expectations, our platform offers a seamless way
                  to stay visible and competitive. We support every practitioner
                  not just with visibility but with tools that empower their
                  professional journey—from detailed profiles to treatment
                  showcases and lead generation.
                </p>

                <blockquote
                  className="rounded-2xl border-l-4 bg-[#f3af6a20] p-4 sm:p-6"
                  style={{
                    borderLeftColor: '#356574',
                  }}
                >
                  <span className="text-lg font-semibold text-gray-900 italic sm:text-xl">
                    "A world where dentistry meets innovation—seamless, smart,
                    and specialized. Ready to upgrade?"
                  </span>
                </blockquote>

                <div className="pt-3 sm:pt-4">
                  <p className="mb-2 text-lg font-semibold text-gray-900 sm:text-xl">
                    Thank you for being a part of the NextDentist community.
                  </p>
                  <div className="rounded-xl bg-[#f4f8f8] p-4 sm:p-6">
                    <p className="text-base font-bold text-gray-900 sm:text-lg">
                      Dr. Megha Vyas
                    </p>
                    <p className="font-semibold text-[#356574]">
                      Director, NextDentist
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      Oral &amp; Maxillofacial Surgery Specialist
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Project Management Section */}
        <article className="rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl sm:rounded-3xl sm:p-8 md:p-12">
          <div className="mb-6 text-center sm:mb-8">
            <h2 className="mb-3 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
              Project Management &amp; Platform Execution
            </h2>
            <div className="mx-auto h-1 w-12 rounded-full bg-[#356574] sm:w-16"></div>
          </div>

          <div className="mx-auto max-w-2xl sm:max-w-3xl md:max-w-4xl">
            <div className="rounded-2xl bg-[#f4f8f8] p-4 sm:p-8">
              <div className="space-y-5 text-base leading-relaxed text-gray-700 sm:space-y-6 sm:text-lg">
                <p>
                  Behind the smooth functioning and continual innovation at
                  NextDentist stands our dedicated Project Manager,{' '}
                  <span className="font-semibold text-[#356574]">
                    Mr. Palak Bhatt
                  </span>
                  . His role ensures that every initiative, update, and feature
                  aligns with our mission and delivers real value to our users.
                </p>
                <p>
                  From managing development timelines to enhancing user
                  experience across the portal, Palak plays a crucial role in
                  executing our roadmap with precision and empathy. His
                  leadership bridges technical execution with community needs,
                  ensuring we remain both efficient and user-first.
                </p>

                <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4 shadow-lg sm:mt-8 sm:p-6">
                  <div className="flex flex-col items-center space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                    <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-[#df9d7c] sm:h-28 sm:w-28">
                      <img
                        src="/images/company/palak bhatt-pro.jpg"
                        alt="Palak Bhatt"
                        className="h-full w-full rounded-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="text-lg font-bold text-gray-900 sm:text-xl">
                        Palak Bhatt
                      </p>
                      <p className="font-semibold text-[#df9d7c]">
                        Project Manager, NextDentist
                      </p>
                      <p className="text-sm text-gray-600">
                        Strategic Planning &amp; Platform Excellence
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Bottom Decorative Element */}
        <footer className="mt-10 text-center sm:mt-16">
          <div className="inline-flex items-center space-x-2 text-gray-500">
            <div className="h-0.5 w-6 rounded-full bg-[#356574] opacity-30 sm:w-8"></div>
            <div className="h-3 w-3 rounded-full bg-[#356574]"></div>
            <div className="h-0.5 w-6 rounded-full bg-[#356574] opacity-30 sm:w-8"></div>
          </div>
        </footer>
      </div>
    </section>
  );
};

export default DirectorsDesk;
