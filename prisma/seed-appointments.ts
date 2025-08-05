import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedAppointments() {
  console.log('🌱 Seeding appointments...');

  try {
    // Get existing dentists and users
    const dentists = await prisma.dentist.findMany({
      take: 5,
      include: { user: true },
    });

    const users = await prisma.user.findMany({
      where: { role: 'USER' },
      take: 10,
    });

    if (dentists.length === 0) {
      console.log('❌ No dentists found. Please seed dentists first.');
      return;
    }

    const appointmentStatuses = [
      'PENDING',
      'APPROVED', 
      'REJECTED',
      'CANCELLED_BY_PATIENT',
      'CANCELLED_BY_DENTIST',
      'RESCHEDULED',
      'COMPLETED',
      'NO_SHOW',
    ];

    const treatmentNames = [
      'General Checkup',
      'Teeth Cleaning',
      'Root Canal',
      'Tooth Extraction',
      'Dental Filling',
      'Orthodontic Consultation',
      'Teeth Whitening',
      'Dental Implant',
      'Crown Replacement',
      'Gum Treatment',
    ];

    const samplePatients = [
      { name: 'John Smith', phone: '+1234567890', email: 'john.smith@email.com', age: '32', gender: 'Male' },
      { name: 'Sarah Johnson', phone: '+1234567891', email: 'sarah.j@email.com', age: '28', gender: 'Female' },
      { name: 'Michael Brown', phone: '+1234567892', email: 'michael.b@email.com', age: '45', gender: 'Male' },
      { name: 'Emily Davis', phone: '+1234567893', email: 'emily.d@email.com', age: '35', gender: 'Female' },
      { name: 'David Wilson', phone: '+1234567894', email: 'david.w@email.com', age: '52', gender: 'Male' },
      { name: 'Lisa Miller', phone: '+1234567895', email: 'lisa.m@email.com', age: '29', gender: 'Female' },
      { name: 'Robert Taylor', phone: '+1234567896', email: 'robert.t@email.com', age: '41', gender: 'Male' },
      { name: 'Jennifer Anderson', phone: '+1234567897', email: 'jennifer.a@email.com', age: '38', gender: 'Female' },
      { name: 'Christopher Martinez', phone: '+1234567898', email: 'chris.m@email.com', age: '33', gender: 'Male' },
      { name: 'Amanda Thomas', phone: '+1234567899', email: 'amanda.t@email.com', age: '27', gender: 'Female' },
    ];

    const appointments = [];

    // Generate appointments for the past month and next month
    for (let i = 0; i < 50; i++) {
      const dentist = dentists[Math.floor(Math.random() * dentists.length)];
      const patient = samplePatients[Math.floor(Math.random() * samplePatients.length)];
      const user = users.length > 0 ? (Math.random() > 0.5 ? users[Math.floor(Math.random() * users.length)] : null) : null;
      
      // Random date within the past 30 days or next 30 days
      const randomDays = Math.floor(Math.random() * 60) - 30; // -30 to +30 days
      const appointmentDate = new Date();
      appointmentDate.setDate(appointmentDate.getDate() + randomDays);
      appointmentDate.setHours(0, 0, 0, 0);

      // Random appointment time
      const hours = 9 + Math.floor(Math.random() * 8); // 9 AM to 5 PM
      const minutes = Math.random() > 0.5 ? '00' : '30';
      const appointmentTime = `${hours.toString().padStart(2, '0')}:${minutes}`;

      const status = appointmentStatuses[Math.floor(Math.random() * appointmentStatuses.length)];
      const dentistStatus = appointmentStatuses[Math.floor(Math.random() * appointmentStatuses.length)];
      const patientStatus = appointmentStatuses[Math.floor(Math.random() * appointmentStatuses.length)];
      
      const treatmentName = treatmentNames[Math.floor(Math.random() * treatmentNames.length)];

      const reasonTexts = [
        'Patient requested this time slot',
        'Doctor recommended urgent treatment',
        'Follow-up appointment required',
        'Insurance coverage verification needed',
        'Rescheduled due to emergency',
        'Patient cancelled due to illness',
        'Doctor was unavailable',
        'Regular checkup appointment',
      ];

      appointments.push({
        patientName: patient.name,
        patientPhone: patient.phone,
        patientEmail: patient.email,
        patientAge: patient.age,
        gender: patient.gender,
        userId: user?.id,
        treatmentName,
        otherInfo: Math.random() > 0.7 ? 'Patient has dental anxiety. Please be gentle and explain all procedures.' : undefined,
        appointmentDate,
        appointmentTime,
        status: status as any,
        dentistStatus: dentistStatus as any,
        patientStatus: patientStatus as any,
        statusReason: Math.random() > 0.6 ? reasonTexts[Math.floor(Math.random() * reasonTexts.length)] : undefined,
        lastModifiedBy: ['admin', 'dentist', 'patient'][Math.floor(Math.random() * 3)],
        dentistId: dentist.id,
      });
    }

    // Create appointments in batches
    for (const appointment of appointments) {
      await prisma.appointment.create({
        data: appointment,
      });
    }

    console.log(`✅ Created ${appointments.length} appointments`);
    console.log('✅ Appointment seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error seeding appointments:', error);
    throw error;
  }
}

async function main() {
  try {
    await seedAppointments();
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}

export { seedAppointments };
