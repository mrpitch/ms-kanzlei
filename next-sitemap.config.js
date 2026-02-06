/** @type {import('next-sitemap').IConfig} */
module.exports = {
	siteUrl: process.env.SITE_URL || 'https://mskanzlei.mrpitch.rocks',
	generateRobotsTxt: true, // (optional)
	// ...other options
}
