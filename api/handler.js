function buildHTML(path, repo) {
  return [
    '<!doctype html>',
    '<head>',
    `<title>${path}</title>`,
    `<meta name="go-import" content="${path} git ${repo}">`,
    `<meta name="go-source" content="${path} _ ${repo}/tree/master{/dir} ${repo}/blob/master{/dir}/{file}#L{line}">`,
    '</head>',
    '<body>',
    path,
    '</body>',
    '</html>'
  ].join('');
}

module.exports = (req, res) => {
  if (req.url && req.url.toLowerCase() === '/favicon.ico') {
    res.statusCode = 204;
    return res.end();
  }

  const username = process.env.VANITYURLS_GITHUB_USERNAME;

  if (!username) {
    return res.status(500).send('Vercel Vanity URLs error: GitHub username not provided.');
  }

  const package = req.url.slice(1).trim();
  if (!package.length) {
    res.writeHead(301, {
      Location: `https://github.com/${username}`
    });
    return res.end();
  }


  const path = `${req.headers.host}/${package}`;
  const repo = `https://github.com/${username}/${package}`;
  return res.send(buildHTML(path, repo));
};
