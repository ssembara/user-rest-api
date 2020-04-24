const User = require('../models/userModel')
const multer = require('multer')
const path = require('path')

exports.register = async (req, res) => {
  try {
    const user = new User(req.body)
    const token = await user.generateAuthToken()
    await user.save()
    const contact = await user.generateContactBook()
    res.status(201).send({
      status: res.statusCode,
      success: true,
      messages: 'New user created!',
      token: token,
    })
  } catch (error) {
    console.log(error)
    res.status(400).send({
      status: res.statusCode,
      success: false,
      messages: 'Failed to register a new user!',
      error,
    })
  }
}

exports.login = async (req, res) => {
  // Declaration
  let email = req.body.email
  let password = req.body.password

  // Try-Catch
  try {
    const user = await User.findByCredentials(email, password)
    const token = await user.generateAuthToken()
    res.status(200).send({
      status: res.statusCode,
      success: true,
      messages: 'Auth successfully!',
      token: token,
    })
  } catch (error) {
    res.status(422).send({
      status: res.statusCode,
      success: false,
      messages: 'Cannot find the credentials',
    })
  }
}

exports.showUserLogin = async (req, res) => {
  // Declare
  let id = req.user._id
  let email = req.user.email
  let username = req.user.username
  let about = req.user.about
  let avatar = req.user.avatar

  // Response
  res.send({
    status: res.statusCode,
    success: true,
    messages: 'Success load data!',
    user: {
      _id: id,
      email: email,
      username: username,
      about: about,
      avatar: avatar,
    },
  })
}

exports.updateUserLogin = async (req, res) => {
  // Try-Catch
  try {
    await User.findByIdAndUpdate(req.user.id, { $set: req.body })
    res.status(201).send({
      status: res.statusCode,
      success: true,
      messages: 'Data updated',
    })
  } catch (error) {
    res.status(500).send({
      status: res.statusCode,
      success: false,
      messages: 'Failed to update data',
    })
  }
}

exports.index = async (req, res) => {
  // Try-Catch
  try {
    const user = await User.find({})
    res.status(200).send({
      status: res.statusCode,
      success: true,
      messages: 'Success load data!',
      user,
    })
  } catch (e) {
    res.status(500).send({
      status: res.statusCode,
      success: false,
      messages: 'Server error!',
      e,
    })
  }
}

exports.findUsername = async (req, res) => {
  // Declaration
  const username = req.body.username

  // Try-Catch
  try {
    const findUser = await User.findOne({ username })
    if (findUser) {
      res.status(200).send({
        status: res.statusCode,
        success: true,
        messages: 'User find!',
        user: {
          _id: findUser._id,
          username: findUser.username,
          avatar: findUser.avatar,
        },
      })
    } else {
      res.status(200).send({
        status: res.statusCode,
        success: true,
        messages: 'User not found!',
        user: findUser,
      })
    }
  } catch (e) {
    res.status(500).send({
      status: res.statusCode,
      success: false,
      messages: 'Server Error!',
    })
  }
}

exports.uploadAvatar = async (req, res) => {
  const diskStorageToUploads = multer.diskStorage({
    destination: path.join('./public/uploads/avatar'),

    filename: (req, file, cb) => {
      cb(
        null,
        file.fieldname + '-' + req.user._id + path.extname(file.originalname)
      )
    },
  })

  let fileFilter = function(req, file, cb) {
    // fileTypeValidation
    var allowedMimes = ['image/jpeg', 'image/pjpeg', 'image/png']
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(
        {
          status: res.statusCode,
          success: false,
          message: 'Invalid file type. Only jpg, png image files are allowed.',
        },
        false
      )
    }
  }

  // fileSizeValidation
  const saveToUploads = multer({
    storage: diskStorageToUploads,
    limits: {
      fileSize: 200 * 1024 * 1024,
    },
    fileFilter: fileFilter,
  })

  const upload = saveToUploads.single('avatar')

  upload(req, res, function(error) {
    if (error) {
      //instanceof multer.MulterError
      res.status(500)
      if (error.code == 'LIMIT_FILE_SIZE') {
        error.success = false
        error.message = 'File Size is too large. Allowed file size is 2 MB'
      }
      console.log(error)
      return res.json(error)
    } else {
      if (!req.file) {
        res.status(500)
        res.json('File not found')
      }

      const fileName =
        req.protocol +
        '://' +
        req.get('host') +
        '/uploads/avatar/' +
        req.file.filename

      User.findByIdAndUpdate(
        req.user._id,
        { $set: { avatar: fileName } },
        function(err) {
          if (res.status == 500) {
            console.log(err)
            res.send({ Message: 'Failed to Update Data!' })
          } else {
            res.status(201).send({
              status: res.statusCode,
              success: true,
              message: 'Image uploaded successfully!',
              avatar: fileName,
            })
          }
        }
      )
    }
  })
}
