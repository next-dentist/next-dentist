'use client';

import IconBox from '@/components/IconBox';
import { Award, Briefcase, GraduationCap, Languages } from 'lucide-react';
import {
  AlumniItem,
  AwardItem,
  Degree,
  DentistWithRelations,
  WorkingAtItem,
} from './types';

interface ExperienceTabProps {
  dentist: DentistWithRelations;
  awards: AwardItem[];
  alumniOf: AlumniItem[];
  workingAt: WorkingAtItem[];
  degreeData: Degree[];
  languages: string[];
  specializations: string[];
}

export const ExperienceTab: React.FC<ExperienceTabProps> = ({
  dentist,
  awards,
  alumniOf,
  workingAt,
  degreeData,
  languages,
  specializations,
}) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="mb-4 text-4xl font-bold text-[#356574]">
          Professional Experience
        </h2>
        <p className="mx-auto max-w-3xl text-xl text-[#92b5b9]">
          Education, awards, and professional background
        </p>
      </div>

      {/* Awards */}
      {awards.length > 0 && (
        <div className="space-y-4">
          <h3 className="flex items-center text-2xl font-bold text-[#356574]">
            <Award className="mr-3 h-6 w-6 text-[#df9d7c]" />
            Awards & Recognitions
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {awards.map((award, index) => (
              <IconBox
                key={`award-${index}`}
                id={`award-${index}`}
                icon="Award"
                title={award.name}
                content={`Awarded: ${new Date(
                  award.dateAwarded
                ).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                })}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {(alumniOf.length > 0 || degreeData.length > 0) && (
        <div className="space-y-4">
          <h3 className="flex items-center text-2xl font-bold text-[#356574]">
            <GraduationCap className="mr-3 h-6 w-6 text-[#df9d7c]" />
            Education & Qualifications
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {degreeData.map(degree => (
              <IconBox
                key={`degree-${degree.id}`}
                id={`degree-${degree.id}`}
                icon="GraduationCap"
                title={degree.name}
                content={degree.fullName}
              />
            ))}
            {alumniOf.map((alumni, index) => (
              <IconBox
                key={`alumni-${index}`}
                id={`alumni-${index}`}
                icon="School"
                title={alumni.name}
                content="Educational Institution"
                link={
                  alumni.sameAs?.startsWith('http') ? alumni.sameAs : undefined
                }
                linkText={
                  alumni.sameAs?.startsWith('http') ? 'Learn more' : undefined
                }
              />
            ))}
          </div>
        </div>
      )}

      {/* Work Experience */}
      {workingAt.length > 0 && (
        <div className="space-y-4">
          <h3 className="flex items-center text-2xl font-bold text-[#356574]">
            <Briefcase className="mr-3 h-6 w-6 text-[#df9d7c]" />
            Work Experience
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {workingAt.map((exp, index) => (
              <IconBox
                key={`work-${index}`}
                id={`work-${index}`}
                icon="Briefcase"
                title={exp.name}
                content={`${exp.position} - Since ${new Date(
                  exp.startDate
                ).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                })}`}
                link={exp.sameAs?.startsWith('http') ? exp.sameAs : undefined}
                linkText={
                  exp.sameAs?.startsWith('http')
                    ? 'Visit Organization'
                    : undefined
                }
              />
            ))}
          </div>
        </div>
      )}

      {/* Languages & Specializations */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {languages.length > 0 && (
          <div className="space-y-4">
            <h3 className="flex items-center text-xl font-bold text-[#356574]">
              <Languages className="mr-3 h-5 w-5 text-[#df9d7c]" />
              Languages
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {languages.map((language: string, index: number) => (
                <IconBox
                  key={`language-${index}`}
                  id={`language-${index}`}
                  icon="Languages"
                  title={language}
                  content="Spoken Language"
                />
              ))}
            </div>
          </div>
        )}

        {specializations.length > 0 && (
          <div className="space-y-4">
            <h3 className="flex items-center text-xl font-bold text-[#356574]">
              <Award className="mr-3 h-5 w-5 text-[#df9d7c]" />
              Specializations
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {specializations.map((specialization: string, index: number) => (
                <IconBox
                  key={`specialization-${index}`}
                  id={`specialization-${index}`}
                  icon="Star"
                  title={specialization}
                  content="Area of Expertise"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
