import { cleanPastedHtml, convertPlainTextToHtml } from './htmlCleaner';

// Load the actual raw.html content
const rawHtmlContent = `Sure! Here's a general set of **instructions for dental implant patients**, divided into **pre-operative, post-operative, and long-term care** guidelines. These instructions are meant to help ensure successful healing and long-term success of your dental implants.

---

## 🦷 Dental Implants: Step-by-Step Instructions

### 1. **Pre-Operative Instructions (Before Surgery)**

#### A. Consultation & Planning
- Attend all pre-surgical appointments.
- Provide your complete medical history, including medications, allergies, and conditions like diabetes or heart disease.
- Inform your dentist if you are pregnant or taking blood thinners.
- Undergo imaging scans (like CBCT) and dental impressions as needed.

#### B. Before the Day of Surgery
- Follow any dietary restrictions (usually no food or drink 6–8 hours before surgery if under general anesthesia).
- Take prescribed medications as directed (e.g., antibiotics or anti-inflammatory drugs).
- Arrange for someone to drive you home after surgery.

#### C. On the Day of Surgery
- Wear comfortable clothing.
- Avoid wearing makeup, jewelry, or contact lenses.
- Brush your teeth gently before coming in.

---

### 2. **Post-Operative Instructions (After Surgery)**

> 💡 Follow these carefully to reduce complications and promote healing.

#### A. First 24 Hours
- **Bite on gauze pad**: Keep pressure on the surgical site for 30–60 minutes to control bleeding.
- **Avoid spitting, rinsing, or using straws**: This helps prevent dislodging the blood clot.
- **Apply ice packs**: Use intermittently (15 min on/off) to reduce swelling.
- **Take medications as prescribed**: Painkillers, antibiotics, and anti-inflammatories should be taken exactly as instructed.

#### B. Diet
- Stick to **soft foods** (e.g., soup, mashed potatoes, yogurt) for the first few days.
- Stay hydrated with cool or warm liquids.
- Avoid hot, spicy, crunchy, or chewy foods until cleared by your dentist.

#### C. Oral Hygiene
- **Do not brush near the surgical site** for the first 24 hours.
- After 24 hours, gently rinse with **warm salt water** (1/2 tsp salt in 8 oz warm water) several times a day.
- Begin brushing carefully around the area after 24 hours, avoiding direct contact with the surgical site.
- Use an antimicrobial mouthwash if prescribed.

#### D. Activity
- Rest and keep your head elevated.
- Avoid strenuous exercise for at least 48–72 hours.
- Do not smoke — smoking can significantly impair healing and increase implant failure risk.

#### E. Watch for Complications
Contact your dentist immediately if you experience:
- Excessive bleeding that doesn't stop
- Severe pain not relieved by medication
- Swelling that worsens after 2–3 days
- Fever or signs of infection
- Numbness that doesn't go away

---

### 3. **Healing Period (Osseointegration Phase)**

- Healing typically takes **3–6 months**, depending on your jawbone density and implant location.
- Avoid placing pressure or chewing on the implant site during this time (if it's a temporary restoration).
- Attend all follow-up appointments to monitor healing and integration.

---

### 4. **Long-Term Care of Dental Implants**

Once your permanent crown, bridge, or denture is placed:

#### A. Oral Hygiene
- Brush twice daily with a soft-bristled toothbrush.
- Floss daily, especially around the implant(s).
- Use interdental brushes or water flossers as recommended.
- Continue using antimicrobial mouthwash if advised.

#### B. Regular Dental Visits
- Visit your dentist every 6 months or as recommended.
- Professional cleanings are essential for maintaining implant health.

#### C. Lifestyle Habits
- Avoid smoking — it increases the risk of peri-implantitis (infection around the implant).
- Avoid chewing hard objects like ice or pens.
- If you grind your teeth, ask about a night guard to protect implants and restorations.

---

## ✅ Summary Checklist

| Task | When |
|------|------|
| Pre-op consultation | Before surgery |
| Fast before surgery | As instructed |
| Bite on gauze after surgery | Immediately after procedure |
| Ice pack for swelling | First 24 hours |
| Soft diet | First few days |
| Saltwater rinses | After 24 hours |
| No smoking or alcohol | At least 72 hours |
| Attend follow-ups | As scheduled |
| Maintain oral hygiene | Daily, long-term |
| Regular dental checkups | Every 6 months |

---

Would you like a printable version of these instructions or a version tailored specifically for a patient receiving full-mouth implants, All-on-4, or sinus lift procedures?`;

// Test data from raw.html
const rawHtml = `<h3 data-spm-anchor-id="a2ty_o01.29997173.0.i13.1fa9c921PQGXex">4. <strong data-spm-anchor-id="a2ty_o01.29997173.0.i6.1fa9c921PQGXex">Long-Term Care of Dental Implants</strong></h3>
<p data-spm-anchor-id="a2ty_o01.29997173.0.i9.1fa9c921PQGXex">Once your permanent crown, bridge, or denture is placed:</p>
<div class="my-2">&nbsp;</div>
<h4>A. Oral Hygiene</h4>
<ul data-spm-anchor-id="a2ty_o01.29997173.0.i8.1fa9c921PQGXex">
<li>Brush twice daily with a soft-bristled toothbrush.</li>
<li>Floss daily, especially around the implant(s).</li>
<li>Use interdental brushes or water flossers as recommended.</li>
<li>Continue using antimicrobial mouthwash if advised.</li>
</ul>
<div class="my-2">&nbsp;</div>
<h4>B. Regular Dental Visits</h4>
<ul>
<li>Visit your dentist every 6 months or as recommended.</li>
<li>Professional cleanings are essential for maintaining implant health.</li>
</ul>
<div class="my-2">&nbsp;</div>
<h4>C. Lifestyle Habits</h4>
<ul>
<li>Avoid smoking &mdash; it increases the risk of peri-implantitis (infection around the implant).</li>
<li>Avoid chewing hard objects like ice or pens.</li>
<li data-spm-anchor-id="a2ty_o01.29997173.0.i11.1fa9c921PQGXex">If you grind your teeth, ask about a night guard to protect implants and restorations.</li>
</ul>`;

// Expected output (from procced.html)
const expectedHtml = `<h3>
	4.
	<strong>
		Long-Term Care of Dental Implants
	</strong>
</h3>
<p>
	Once your permanent crown, bridge, or denture is placed:
</p>
<h4>
	A. Oral Hygiene
</h4>
<ul>
	<li>
		Brush twice daily with a soft-bristled toothbrush.
	</li>
	<li>
		Floss daily, especially around the implant(s).
	</li>
	<li>
		Use interdental brushes or water flossers as recommended.
	</li>
	<li>
		Continue using antimicrobial mouthwash if advised.
	</li>
</ul>
<h4>
	B. Regular Dental Visits
</h4>
<ul>
	<li>
		Visit your dentist every 6 months or as recommended.
	</li>
	<li>
		Professional cleanings are essential for maintaining implant health.
	</li>
</ul>
<h4>
	C. Lifestyle Habits
</h4>
<ul>
	<li>
		Avoid smoking &mdash; it increases the risk of peri-implantitis (infection around the implant).
	</li>
	<li>
		Avoid chewing hard objects like ice or pens.
	</li>
	<li>
		If you grind your teeth, ask about a night guard to protect implants and restorations.
	</li>
</ul>`;

/**
 * Test the HTML cleaner with the provided example
 */
export function testHtmlCleaner(): void {
  
  const cleaned = cleanPastedHtml(rawHtml);
  
  
  // Basic comparison (normalize whitespace for comparison)
  const normalizeWhitespace = (str: string) => str.replace(/\s+/g, ' ').trim();
  const cleanedNormalized = normalizeWhitespace(cleaned);
  const expectedNormalized = normalizeWhitespace(expectedHtml);
  
  if (cleanedNormalized !== expectedNormalized) {
  }
}

/**
 * Test plain text to HTML conversion
 */
export function testPlainTextConversion(): void {
  
  const converted = convertPlainTextToHtml(rawHtmlContent);
  
  const cleaned = cleanPastedHtml(rawHtmlContent);
  
}

/**
 * Test the conversion from raw.html to procced.html format
 */
export function testRawToProccedConversion(): void {
  
  const converted = convertPlainTextToHtml(rawHtmlContent);
  
  // Test with the cleaner as well
  const cleaned = cleanPastedHtml(rawHtmlContent);
  
}

// Export the test data for use in components
const plainTextInstructions = rawHtmlContent; // Alias for backward compatibility
export { expectedHtml, plainTextInstructions, rawHtml, rawHtmlContent };

