import multer from 'multer';

const upload = multer();

export const config = {
  api: {
    bodyParser: false,
  },
};

function runMiddleware(req, res) {
  return new Promise((resolve, reject) => {
    upload.array('files')(req, res, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: '只支持 POST 请求' });
    return;
  }

  // 验证上传密码
  const UPLOAD_PASSWORD = process.env.UPLOAD_PASSWORD || 'Hh12345';
  const password = req.headers['x-upload-password'] || req.query.password;

  if (!password || password !== UPLOAD_PASSWORD) {
    res.status(401).json({ error: '上传密码错误' });
    return;
  }

  try {
    await runMiddleware(req, res);
  } catch (e) {
    res.status(400).json({ error: '文件上传失败: ' + e.message });
    return;
  }

  const files = req.files;
  if (!files || files.length === 0) {
    res.status(400).json({ error: '未检测到文件' });
    return;
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GITHUB_REPO = process.env.GITHUB_REPO;
  const GITHUB_PATH = process.env.GITHUB_PATH || 'img';

  if (!GITHUB_TOKEN || !GITHUB_REPO) {
    res.status(500).json({ error: '服务器未配置 GitHub 令牌或仓库' });
    return;
  }

  const results = [];

  for (const file of files) {
    const randomStr = Math.random().toString(36).slice(2, 8);
    const fileName = `${randomStr}_${file.originalname}`;
    const apiUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_PATH}/${fileName}`;
    const contentBase64 = file.buffer.toString('base64');
    const message = `upload file ${fileName}`;
    const body = { message, content: contentBase64 };

    try {
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
          Accept: 'application/vnd.github+json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        results.push({ file: file.originalname, error: errorData.message || '上传失败' });
      } else {
        const rawUrl = `https://img1.keaeye.fun/${GITHUB_PATH}/${fileName}`;
        results.push({ file: file.originalname, url: rawUrl });
      }
    } catch (e) {
      results.push({ file: file.originalname, error: e.message });
    }
  }

  res.status(200).json(results);
}
