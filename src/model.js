export const sections = [
  { title: 'Your background', fields: [
    ['education', 'School or institution'], ['degree', 'Degree or field of study'],
    ['graduation', 'Expected graduation', 'month'], ['skills', 'Technical and professional skills'],
    ['experience', 'Relevant experience', 'textarea'], ['resumeText', 'Resume or profile', 'textarea'],
  ] },
  { title: 'What you want next', fields: [
    ['roles', 'Target roles'], ['industries', 'Preferred industries'], ['locations', 'Preferred locations'],
  ] },
  { title: 'Eligibility and availability', fields: [
    ['authorization', 'Work authorization'], ['availability', 'Internship availability'],
  ] },
]

export const completion = (profile) => {
  const fields = [...sections.flatMap(({ fields }) => fields.map(([key]) => key)), 'priorities']
  return Math.round(fields.filter((key) => profile[key]?.length).length / fields.length * 100)
}

export const priorities = ['Product', 'TPM', 'Strategy / Ops', 'Software engineering', 'Data and analytics',
  'AI Exposure', 'Startup', 'Large Company', 'Technical Depth', 'Ownership', 'Career Growth', 'Compensation',
  'California', 'Texas', 'Toronto', 'Vancouver', 'New York']

export const titleOf = (item) => item.title || 'Untitled opportunity'

export const opportunityFields = [
  ['title', 'Job title'], ['company', 'Company'], ['location', 'Location'],
  ['deadline', 'Application deadline', 'date'], ['url', 'Posting URL', 'url'],
]
