const filters = (njk) => {
  njk.addFilter('slug', (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
  njk.addFilter('readableDateTime', (date) => new Date(date).toLocaleString('en-EN', {dateStyle: 'long', timeStyle: 'medium', hourCycle: 'h24'}));
}

export default filters;
