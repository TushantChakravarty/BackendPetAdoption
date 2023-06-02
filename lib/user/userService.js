const dao = require("./userDao");
const usrConst = require("./userConstants");
const mapper = require("./userMapper");
const appUtils = require("../appUtils");
const jwtHandler = require("../jwtHandler");
const appUtil = require("../appUtils");
const Email = require("./userEmail");
const Template = require("./emailTemplate");
const FCM = require('fcm-node')
const admin = require("firebase-admin");

const serviceAccount = require("./petspace-48612-firebase-adminsdk-n8p8v-7b48a1d0e2.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

var fcm = new FCM(serviceAccount)




function register(details) {
  if (!details) {
    return mapper.responseMapping(
      usrConst.CODE.BadRequest,
      usrConst.MESSAGE.InvalidDetails
    );
  } else {
    if (details.emailId) {
      let query = {
        emailId: details.emailId,
      };

      return dao
        .getUserDetails(query)
        .then(async (userExists) => {
          if (userExists) {
            return mapper.responseMapping(
              usrConst.CODE.BadRequest,
              usrConst.MESSAGE.EmailAlreadyExists
            );
          } else {
            let convertedPass = await appUtil.convertPass(details.password);
            details.password = convertedPass;

            /*let verificationCode = Math.floor(Math.random() * (999999 - 100000) + 100000)
                    console.log({ verificationCode })
                    

                   
                    details.OTP = verificationCode
                    details.isEmailVerified=false*/

            /*
                    details.otpUpdatedAt = new Date().getTime()
                    details.createdAt = new Date().getTime()
                    details.isIdentityVerified = false
                   
                    let loginActivity = []
                    loginActivity.push({
                       
                        status: 'active'
                    })*/

            // details.loginActivity = loginActivity

            /*   let mailSent = Email.sendMessage( details.emailId)
                            console.log({ mailSent })*/
            const data = {
              emailId: details.emailId.toLowerCase(),
              password: details.password,
            };

            return dao
              .createUser(data)
              .then((userCreated) => {
                if (userCreated) {
                  /* const EmailTemplate=Template.register(details.OTP)
                //console.log(isExist.emailId)
                           let mailSent = Email.sendMessage2(details.emailId,EmailTemplate)
                            console.log(mailSent)*/
                  let filteredUserResponseFields = mapper.filteredUserResponseFields(
                    userCreated
                  );
                  console.log(userCreated);
                  return mapper.responseMappingWithData(
                    usrConst.CODE.Success,
                    usrConst.MESSAGE.Success,
                    filteredUserResponseFields
                  );
                } else {
                  console.log("Failed to save user");
                  return mapper.responseMapping(
                    usrConst.CODE.INTRNLSRVR,
                    usrConst.MESSAGE.internalServerError
                  );
                }
              })
              .catch((err) => {
                console.log({ err });
                return mapper.responseMapping(
                  usrConst.CODE.INTRNLSRVR,
                  usrConst.MESSAGE.internalServerError
                );
              });
          }
        })
        .catch((err) => {
          console.log({ err });
          return mapper.responseMapping(
            usrConst.CODE.INTRNLSRVR,
            usrConst.MESSAGE.internalServerError
          );
        });
    }
  }
}

async function saveUserDetails(details) {
  console.log("saving user wallet", details);
  if (!details) {
    return mapper.responseMapping(
      usrConst.CODE.BadRequest,
      usrConst.MESSAGE.InvalidDetails
    );
  } else {
    if (details.user) {
      let query = {
        user: details.user,
      };

      return dao
        .getUserDetails(query)
        .then(async (userExists) => {
          if (userExists) {
            if (userExists.accounts) {
              const accounts = userExists.accounts;
              let exists;
              accounts.map((account) => {
                console.log(account.accountName == details.accountName);
                if (account.accountName == details.accountName) {
                  exists = true;
                }
              });
              console.log(exists);
              if (exists === true) {
                return mapper.responseMapping(
                  usrConst.CODE.BadRequest,
                  usrConst.MESSAGE.userNameExists
                );
              } else {
                console.log(userExists);
                const updateObj = {
                  accountName: details.accountName,
                  walletAddress: details.walletAddress,
                };

                return dao.updateWallet(query, updateObj).then((updated) => {
                  if (updated) {
                    console.log("updated", updated);
                    return mapper.responseMappingWithData(
                      usrConst.CODE.Success,
                      usrConst.MESSAGE.Success,
                      updated
                    );
                  } else {
                    return mapper.responseMapping(403, "Failed to update");
                  }
                });
              }
            } else {
              const updateObj = {
                accountName: details.accountName,
                walletAddress: details.walletAddress,
              };

              return dao.updateWallet(query, updateObj).then((updated) => {
                if (updated) {
                  console.log("updated", updated);
                  return mapper.responseMappingWithData(
                    usrConst.CODE.Success,
                    usrConst.MESSAGE.Success,
                    updated
                  );
                } else {
                  return mapper.responseMapping(403, "Failed to update");
                }
              });
            }
            //return mapper.responseMapping(usrConst.CODE.BadRequest, usrConst.MESSAGE.EmailAlreadyExists)
          } else {
            return mapper.responseMapping(404, usrConst.MESSAGE.InvalidDetails);
          }
        })
        .catch((err) => {
          console.log({ err });
          return mapper.responseMapping(
            usrConst.CODE.INTRNLSRVR,
            usrConst.MESSAGE.internalServerError
          );
        });
    }
  }
}

function confirmOtp(details) {
  if (!details) {
    return mapper.responseMapping(
      usrConst.CODE.BadRequest,
      usrConst.MESSAGE.InvalidDetails
    );
  } else {
    if (details.emailId) {
      let query = {
        emailId: details.emailId,
      };

      return dao
        .getUserDetails(query)
        .then(async (userExists) => {
          if (!userExists) {
            return mapper.responseMapping(
              usrConst.CODE.BadRequest,
              "user does not exist"
            );
          } else {
            console.log(userExists);
            if (userExists.OTP == details.otp) {
              let updateObj = {
                isEmailVerified: true,
              };

              return dao.updateProfile(query, updateObj).then((userUpdated) => {
                if (userUpdated) {
                  // let usrObj = {
                  //     _id: userUpdated._id,
                  //     emailId: userUpdated.emailId,
                  //     contactNumber: userUpdated.contactNumber
                  // }
                  // return jwtHandler.genUsrToken(usrObj).then((token) => {
                  console.log("success");
                  return mapper.responseMapping(
                    usrConst.CODE.Success,
                    usrConst.MESSAGE.Success
                  );
                } else {
                  console.log("error");
                  return mapper.responseMapping(
                    usrConst.CODE.INTRNLSRVR,
                    "server error"
                  );
                }
              });
            } else {
              console.log("invalid otp");
              return mapper.responseMapping(
                usrConst.CODE.InvalidOtp,
                "invalid OTP"
              );
            }
          }
        })
        .catch((err) => {
          console.log({ err });
          return mapper.responseMapping(
            usrConst.CODE.INTRNLSRVR,
            usrConst.MESSAGE.internalServerError
          );
        });
    }
  }
}

/**
 * Login
 * @param {Object} details user details
 */
function login(details) {
  if (!details || Object.keys(details).length == 0) {
    return mapper.responseMapping(
      usrConst.CODE.BadRequest,
      usrConst.MESSAGE.InvalidDetails
    );
  } else {
    let query = {};
    if (details.emailId) {
      query.emailId = details.emailId.toLowerCase();
    }

    return dao
      .getUserDetails(query)
      .then(async (userDetails) => {
        console.log(query);
        console.log(userDetails);

        if (userDetails) {
          /*  if(!userDetails.isEmailVerified){
                    return mapper.responseMapping(401,'Please verify your account first')
                }*/

          let isValidPassword = await appUtils.verifyPassword(
            details,
            userDetails
          );
          //let isValidPassword = true;
          console.log(isValidPassword);

          if (isValidPassword) {
            let token = await jwtHandler.genUsrToken(details);
            console.log(token);
            details.token = token;
            let updateObj = {
              token: token,
            };

            return dao
              .updateProfile(query, updateObj)
              .then((userUpdated) => {
                if (userUpdated) {
                  console.log("success", userUpdated);
                  updateObj.user = userUpdated.emailId;
                  return mapper.responseMappingWithData(
                    usrConst.CODE.Success,
                    usrConst.MESSAGE.Success,
                    updateObj
                  );
                } else {
                  console.log("Failed to update verification code");
                  return mapper.responseMapping(
                    usrConst.CODE.INTRNLSRVR,
                    usrConst.MESSAGE.internalServerError
                  );
                }
              })
              .catch((err) => {
                console.log({ err });
                return mapper.responseMapping(
                  usrConst.CODE.INTRNLSRVR,
                  usrConst.MESSAGE.internalServerError
                );
              });
          } else {
            return mapper.responseMapping(
              405,
              usrConst.MESSAGE.InvalidPassword
            );
          }
        } else {
          return mapper.responseMapping(
            usrConst.CODE.DataNotFound,
            usrConst.MESSAGE.UserNotFound
          );
        }
      })
      .catch((err) => {
        console.log({ err });
        return mapper.responseMapping(
          usrConst.CODE.INTRNLSRVR,
          usrConst.MESSAGE.internalServerError
        );
      });
  }
}

/**
 * Forgot password
 * @param {String} emailId email id of user to send password recovery link
 *
 *
 */

function createProfile(details) {
  console.log("My Details", details);
  if (!details) {
    return mapper.responseMapping(
      usrConst.CODE.BadRequest,
      usrConst.MESSAGE.InvalidDetails
    );
  } else {
    let query = {};
    if (details.emailId) {
      query.emailId = details.emailId.toLowerCase();
    }

    return dao
      .getUserDetails(query)
      .then(async (userDetails) => {
        console.log(userDetails);

        if (userDetails) {
          const updateObj = {
            name: details.name,
            state: details.state,
            city: details.city,
            phoneNumber: details.phoneNumber,
            profilePhotoUri: details.profilePhotoUri,
            bio: details.bio,
            uniqueId:details.uniqueId
          };
          return dao
            .updateProfile(query, updateObj)
            .then((userUpdated) => {
              if (userUpdated) {
                console.log("success", userUpdated);
                updateObj.user = userUpdated.emailId;
                return mapper.responseMappingWithData(
                  usrConst.CODE.Success,
                  usrConst.MESSAGE.Success,
                  updateObj
                );
              } else {
                console.log("Failed to update profile");
                return mapper.responseMapping(
                  usrConst.CODE.INTRNLSRVR,
                  usrConst.MESSAGE.internalServerError
                );
              }
            })
            .catch((err) => {
              console.log({ err });
              return mapper.responseMapping(
                usrConst.CODE.INTRNLSRVR,
                usrConst.MESSAGE.internalServerError
              );
            });
        } else {
          return mapper.responseMapping(
            usrConst.CODE.DataNotFound,
            usrConst.MESSAGE.UserNotFound
          );
        }
      })
      .catch((err) => {
        console.log({ err });
        return mapper.responseMapping(
          usrConst.CODE.INTRNLSRVR,
          usrConst.MESSAGE.internalServerError
        );
      });
  }
}

function updateProfile(details) {
  console.log("My Details", details);
  if (!details || !details.emailId) {
    return mapper.responseMapping(
      usrConst.CODE.BadRequest,
      usrConst.MESSAGE.InvalidDetails
    );
  } else {
    let query = {};
    if (details.emailId) {
      query.emailId = details.emailId.toLowerCase();
    }

    return dao
      .getUserDetails(query)
      .then(async (userDetails) => {
        console.log(userDetails);

        if (userDetails) {
          const updateObj = details
          return dao
            .updateProfile(query, updateObj)
            .then((userUpdated) => {
              if (userUpdated) {
                console.log("success", userUpdated);
                updateObj.user = userUpdated.emailId;
                return mapper.responseMappingWithData(
                  usrConst.CODE.Success,
                  usrConst.MESSAGE.Success,
                  updateObj
                );
              } else {
                console.log("Failed to update profile");
                return mapper.responseMapping(
                  usrConst.CODE.INTRNLSRVR,
                  usrConst.MESSAGE.internalServerError
                );
              }
            })
            .catch((err) => {
              console.log({ err });
              return mapper.responseMapping(
                usrConst.CODE.INTRNLSRVR,
                usrConst.MESSAGE.internalServerError
              );
            });
        } else {
          return mapper.responseMapping(
            usrConst.CODE.DataNotFound,
            usrConst.MESSAGE.UserNotFound
          );
        }
      })
      .catch((err) => {
        console.log({ err });
        return mapper.responseMapping(
          usrConst.CODE.INTRNLSRVR,
          usrConst.MESSAGE.internalServerError
        );
      });
  }
}

function forgotPassword(emailId) {
  if (!emailId) {
    return mapper.responseMapping(
      usrConst.CODE.BadRequest,
      usrConst.MESSAGE.InvalidDetails
    );
  } else {
    let query = {
      emailId: emailId,
    };
    return dao
      .getUserDetails(query)
      .then(async (isExist) => {
        if (isExist) {
          console.log(isExist._id);
          const EmailTemplate = Template.forgotPassword(isExist._id);
          //console.log(isExist.emailId)
          let mailSent = Email.sendMessage2(isExist.emailId, EmailTemplate);
          console.log(mailSent);
          //mailHandler.SEND_MAIL(usrObj, templateDetails, serviceDetails)

          return mapper.responseMapping(
            usrConst.CODE.Success,
            usrConst.MESSAGE.ResetPasswordMailSent
          );
        } else {
          return mapper.responseMapping(
            usrConst.CODE.DataNotFound,
            usrConst.MESSAGE.InvalidCredentials
          );
        }
      })
      .catch((e) => {
        console.log({ e });
        return mapper.responseMapping(
          usrConst.CODE.INTRNLSRVR,
          usrConst.MESSAGE.internalServerError
        );
      });
  }
}

/**
 * Set new password
 * @param {string} redisId redis id for recovering password
 * @param {string} password new password to set
 */
async function setNewPassword(redisId, password) {
  if (!redisId || !password) {
    return mapper.responseMapping(
      usrConst.CODE.BadRequest,
      usrConst.MESSAGE.InvalidDetails
    );
  } else {
    console.log(redisId);
    let query = {
      _id: redisId,
    };

    // let isUserExists = await dao.getUserDetails(query)
    let isUserExists = await dao.getUserDetails(query);
    console.log(isUserExists);
    //redisServer.getRedisDetails(redisId)

    if (isUserExists) {
      let newPass = await appUtils.convertPass(password);

      let query = {
        _id: redisId,
      };
      let updateObj = {
        password: newPass,
      };
      return dao
        .updateProfile(query, updateObj)
        .then(async (updateDone) => {
          if (updateDone) {
            //await dao.getServiceDetails(thirdPartyServiceQuery)
            let mailConfig = Email.sendMessage(isUserExists.emailId);
            console.log(mailConfig);
            //mailHandler.SEND_MAIL(mailBodyDetails, templateDetails, serviceDetails)

            return mapper.responseMapping(
              usrConst.CODE.Success,
              usrConst.MESSAGE.PasswordUpdateSuccess
            );
          } else {
            console.log("Failed to reset password");
            return mapper.responseMapping(
              usrConst.CODE.INTRNLSRVR,
              usrConst.MESSAGE.internalServerError
            );
          }
        })
        .catch((e) => {
          console.log({ e });
          return mapper.responseMapping(
            usrConst.CODE.INTRNLSRVR,
            usrConst.MESSAGE.internalServerError
          );
        });
    } else {
      return mapper.responseMapping(
        usrConst.CODE.DataNotFound,
        usrConst.MESSAGE.ResetPasswordLinkExpired
      );
    }
  }
}

async function addPosts(input) {
  try {
    if (input) {
      const query = {
        emailId: input.user,
      };
      const updateDetails = {
        uniqueId:input.uniqueId,
        postNumber:input.postNumber,
        pet: input.pet,
        state: input.state,
        city: input.city,
        age: input.age,
        description: input.description,
        healthDetails: input.healthDetails,
        contactNo: input.contactNo,
        photoUri: input.photoUri,
      };

      let updatePosts = dao
        .addPosts(query, updateDetails)
        .then((userUpdated) => {
          console.log(userUpdated);
          if (userUpdated) {
            return true;
          } else {
            return false;
          }
        })
        .catch((e) => {
          console.log(e);
          return mapper.responseMapping(
            usrConst.CODE.BadRequest,
            "failed to upload posts"
          );
        });

      if (updatePosts) {
        return mapper.responseMapping(
          usrConst.CODE.Success,
          usrConst.MESSAGE.Success
        );
      } else {
        return mapper.responseMapping(
          usrConst.CODE.BadRequest,
          "failed to upload posts"
        );
      }
    } else {
      return mapper.responseMapping(
        usrConst.CODE.BadRequest,
        usrConst.MESSAGE.InvalidDetails
      );
    }
  } catch (e) {
    return mapper.responseMapping(
      usrConst.CODE.BadRequest,
      usrConst.MESSAGE.internalServerError
    );
  }
}

async function allPosts(input) {
  try {
    if (input) {
      const query = {
        _id: "63fddaafb34214071b675a6c",
      };
      const updateDetails = {
        uniqueId:input.uniqueId,
        user: input.user,
        postNumber:input.postNumber,
        pet: input.pet,
        state: input.state,
        city: input.city,
        age: input.age,
        description: input.description,
        healthDetails: input.healthDetails,
        contactNo: input.contactNo,
        photoUri: input.photoUri,
        fcmKey:input.fcmKey,
        name:input.name,
        profilePhotoUri:input.profilePhotoUri
      };

      let updatePosts = dao
        .addToAllPosts(query, updateDetails)
        .then((userUpdated) => {
          console.log(userUpdated);
          if (userUpdated) {
            return true;
          } else {
            return false;
          }
        })
        .catch((e) => {
          console.log(e);
          return mapper.responseMapping(
            usrConst.CODE.BadRequest,
            "failed to upload posts"
          );
        });

      if (updatePosts) {
        return mapper.responseMapping(
          usrConst.CODE.Success,
          usrConst.MESSAGE.Success
        );
      } else {
        return mapper.responseMapping(
          usrConst.CODE.BadRequest,
          "failed to upload posts"
        );
      }
    } else {
      return mapper.responseMapping(
        usrConst.CODE.BadRequest,
        usrConst.MESSAGE.InvalidDetails
      );
    }
  } catch (e) {
    return mapper.responseMapping(
      usrConst.CODE.BadRequest,
      usrConst.MESSAGE.internalServerError
    );
  }
}

function addMessages(details) {
  console.log("My Details", details);
  if (!details) {
    return mapper.responseMapping(
      usrConst.CODE.BadRequest,
      usrConst.MESSAGE.InvalidDetails
    );
  } else {
    let query = {};
    if (details.emailId) {
      query.emailId = details.emailId.toLowerCase();
    }

    return dao
      .getUserDetails(query)
      .then(async (userDetails) => {
        console.log(userDetails);

        if (userDetails) {
          const updateObj = {
           messageId:details.messageId,
           userId:details.userId,
           fcmKey:details.fcmKey,
           name:details.name,
           profilePhotoUri:details.profilePhotoUri
        };
          return dao
            .addMessages(query, updateObj)
            .then((userUpdated) => {
              if (userUpdated) {
                console.log("success", userUpdated);
                updateObj.user = userUpdated.emailId;
                return mapper.responseMappingWithData(
                  usrConst.CODE.Success,
                  usrConst.MESSAGE.Success,
                  updateObj
                );
              } else {
                console.log("Failed to update ");
                return mapper.responseMapping(
                  usrConst.CODE.INTRNLSRVR,
                  usrConst.MESSAGE.internalServerError
                );
              }
            })
            .catch((err) => {
              console.log({ err });
              return mapper.responseMapping(
                usrConst.CODE.INTRNLSRVR,
                usrConst.MESSAGE.internalServerError
              );
            });
        } else {
          return mapper.responseMapping(
            usrConst.CODE.DataNotFound,
            usrConst.MESSAGE.UserNotFound
          );
        }
      })
      .catch((err) => {
        console.log({ err });
        return mapper.responseMapping(
          usrConst.CODE.INTRNLSRVR,
          usrConst.MESSAGE.internalServerError
        );
      });
  }
}

function deleteFromAllPost(details) {
  console.log("My Details", details);
  if (!details) {
    return mapper.responseMapping(
      usrConst.CODE.BadRequest,
      usrConst.MESSAGE.InvalidDetails
    );
  } else {
    let query = {};
    if (details.user) {
      query.user = details.user.toLowerCase();
    }

    return dao
      .getUserDetails(query)
      .then(async (userDetails) => {
        console.log(userDetails);

        if (userDetails) {
          const deleteObj = {
           postNumber:details.postNumber
        };
          return dao
            .deleteFromAllPost(query, deleteObj)
            .then((userUpdated) => {
              if (userUpdated) {
                console.log("success", userUpdated);
                deleteObj.user = userUpdated.emailId;
                return mapper.responseMappingWithData(
                  usrConst.CODE.Success,
                  usrConst.MESSAGE.Success,
                  deleteObj
                );
              } else {
                console.log("Failed to update ");
                return mapper.responseMapping(
                  usrConst.CODE.INTRNLSRVR,
                  usrConst.MESSAGE.internalServerError
                );
              }
            })
            .catch((err) => {
              console.log({ err });
              return mapper.responseMapping(
                usrConst.CODE.INTRNLSRVR,
                usrConst.MESSAGE.internalServerError
              );
            });
        } else {
          return mapper.responseMapping(
            usrConst.CODE.DataNotFound,
            usrConst.MESSAGE.UserNotFound
          );
        }
      })
      .catch((err) => {
        console.log({ err });
        return mapper.responseMapping(
          usrConst.CODE.INTRNLSRVR,
          usrConst.MESSAGE.internalServerError
        );
      });
  }
}

function deleteFromUserPosts(details) {
  console.log("My Details", details);
  if (!details) {
    return mapper.responseMapping(
      usrConst.CODE.BadRequest,
      usrConst.MESSAGE.InvalidDetails
    );
  } else {
    let query = {};
    if (details.user) {
      query.emailId = details.user.toLowerCase();
    }
  console.log(query)

    return dao
      .getUserDetails(query)
      .then(async (userDetails) => {
        console.log(userDetails);

        if (userDetails) {
          const deleteObj = {
           postNumber:details.postNumber
        };
          return dao
            .deleteFromUserPosts(query, deleteObj)
            .then((userUpdated) => {
              if (userUpdated) {
                console.log("success", userUpdated);
                deleteObj.user = userUpdated.emailId;
                return mapper.responseMappingWithData(
                  usrConst.CODE.Success,
                  usrConst.MESSAGE.Success,
                  deleteObj
                );
              } else {
                console.log("Failed to update ");
                return mapper.responseMapping(
                  usrConst.CODE.INTRNLSRVR,
                  usrConst.MESSAGE.internalServerError
                );
              }
            })
            .catch((err) => {
              console.log({ err });
              return mapper.responseMapping(
                usrConst.CODE.INTRNLSRVR,
                usrConst.MESSAGE.internalServerError
              );
            });
        } else {
          return mapper.responseMapping(
            usrConst.CODE.DataNotFound,
            usrConst.MESSAGE.UserNotFound
          );
        }
      })
      .catch((err) => {
        console.log({ err });
        return mapper.responseMapping(
          usrConst.CODE.INTRNLSRVR,
          usrConst.MESSAGE.internalServerError
        );
      });
  }
}


async function getAllPosts() {
  return dao.getAllPosts().then((response) => {
    console.log(response[0].posts);
    const posts = response[0].posts;
    return mapper.responseMappingWithData(
      usrConst.CODE.Success,
      usrConst.MESSAGE.Success,
      posts
    );
  });
  //return mapper.responseMappingWithData(usrConst.CODE.Success,usrConst.MESSAGE.Success,posts)
}

async function getUserProfile(details) {
  let query = {
    emailId: details.emailId,
  };
  console.log(query);
  return dao.getUserProfile(query).then((response) => {
    console.log(response);
    const userDetails = response;
    console.log(response);
    return mapper.responseMappingWithData(
      usrConst.CODE.Success,
      usrConst.MESSAGE.Success,
      userDetails
    );
  });
}

async function sendNotification(details){
  console.log(details)
  var message = { 
    notification: {
      title: details.title, 
      body: `${details.user}: ${details.message}`
    },
    token: details.token
}
return admin.messaging().send(message)
.then((response)=>{
  console.log('success',response)
  return mapper.responseMapping(
    usrConst.CODE.Success,
    usrConst.MESSAGE.Success
  );
})
.catch((e)=>{
  console.log('error',e)
  return mapper.responseMapping(
    usrConst.CODE.INTRNLSRVR,
    usrConst.MESSAGE.internalServerError
  );
})
/*fcm.send(message, function(err, response){
    if (err) {
        console.log(err)
        console.log("Something has gone wrong!")
    } else {
        console.log("Successfully sent with response: ", response)
    }
})*/
}

module.exports = {
  register,

  login,

  forgotPassword,

  setNewPassword,

  confirmOtp,

  saveUserDetails,

  addPosts,

  allPosts,

  getAllPosts,

  createProfile,

  getUserProfile,

  addMessages,

  deleteFromAllPost,

  deleteFromUserPosts,

  updateProfile,

  sendNotification
}
