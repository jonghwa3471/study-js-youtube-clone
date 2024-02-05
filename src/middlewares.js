import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

export const avatarDeleteMiddleware = async (req, res, next) => {
  if (!req.file) {
    console.log("!req.file");
    return next();
  }
  const key = `images/${req.session.user.avatarUrl.split("/")[4]}`;
  const params = {
    Bucket: "wetube-jonghwa",
    Key: key,
  };
  try {
    const data = await s3.send(new DeleteObjectCommand(params));
    console.log("Success. Object deleted.", data);
  } catch (error) {
    console.log("Error", error);
    return res.redirect("/user/edit");
  }
  next();
};

const s3 = new S3Client({
  region: "ap-northeast-2",
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

const isRender = process.env.NODE_ENV === "production";

const s3ImageUploader = multerS3({
  s3: s3,
  bucket: "wetube-jonghwa",
  acl: "public-read",
  key: (req, file, cb) => {
    cb(null, "images/" + file.originalname);
  },
});

const s3VideoUploader = multerS3({
  s3: s3,
  bucket: "wetube-jonghwa",
  acl: "public-read",
  key: (req, file, cb) => {
    cb(null, "videos/" + file.originalname);
  },
});

export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "Wetube";
  res.locals.loggedInUser = req.session.user || {};
  res.locals.isRender = isRender;
  next();
};

export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "Log in first.");
    return res.redirect("/login");
  }
};

export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "Not authorized");
    return res.redirect("/");
  }
};

export const avatarUpload = multer({
  dest: "uploads/avatars/",
  limits: { fileSize: 3000000 },
  storage: isRender ? s3ImageUploader : undefined,
});

export const videoUpload = multer({
  dest: "uploads/videos/",
  limits: { fileSize: 100000000 },
  storage: isRender ? s3VideoUploader : undefined,
});
