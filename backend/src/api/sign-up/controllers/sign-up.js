"use strict";
const axios = require("axios").default;
const _ = require("lodash");
const { sanitize } = require("@strapi/utils");
const emailnotification = require("../../../utils/emailnotification");
var slugify = require('slugify')
const utils = require("../../../utils");
const urlMetadata = require("url-metadata");

/**
 *  sign-up controller
 */

const sanitizeUser = async (user, ctx) => {
  const { auth } = ctx.state;
  const userSchema = strapi.getModel("plugin::users-permissions.user");

  return sanitize.contentAPI.output(user, userSchema, { auth });
};

const getService = (strapi, name) => {
  return strapi.plugin("users-permissions").service(name);
};

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::sign-up.sign-up", ({ strapi }) => ({

  async registerUser(ctx, email){
    const user = await strapi
    .query("plugin::users-permissions.user")
    .findOne({
      where:  { email: email },
      populate: [
        "profilePic",
        "coverImage",
        "user_type",
        "sharedSeo"
      ],
    });
    

    if (user) {
      // const sanitizedUser = sanitizeUser(user, ctx);
      // console.log(user);
      const jwt = getService(strapi, "jwt").issue(_.pick(user, ["id"]));
      // console.log("jwt", jwt);

      strapi.service("api::session.session").create({
        data: {
          ipAddress: ctx.request.header['x-real-ip'],
          user: user.id,
          url:ctx.request.url,
          ipCountry: ctx.request.header['cf-ipcountry'],
          referrer: ctx.request.header['referer']
        }
      });

      return {
        jwt,
        user: user,
      };
    }
    else {
      const res= await axios
        .post("https://api-prod.postcard.travel/api/auth/local/register", {
          username: email,
          email: email,
          password: "strapi123Password",
        });
        if(res?.data){
          await strapi.db
          .query("plugin::users-permissions.user").update({
            where:{email: email 
          },
            data:{
              user_type:1,
              fullName:email.split("@")[0],
              slug:slugify(email.split("@")[0])+"-"+Math.floor((Math.random() * 900) + 100)
            }});
          const user = await strapi.db
          .query("plugin::users-permissions.user")
          .findOne({
            where:  { email: email },
            populate: [
              "profilePic",
              "coverImage",
              "user_type",
              "sharedSeo"
            ],
          });

          return {jwt:res.data.jwt,user:user, isNew:true};
        }
        else
          // Handle error.
          return {
            message: "Server error",
          };
        };
  },

  async create(ctx) {
    // some logic here
    const { data } = ctx.request.body;
    if (!data?.email) return (ctx.body = { error: "invalid email" });
    let entry = {};
    let userslug = "";
    try {
      let rstring = '';
      const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const charactersLength = characters.length;
      for (let i = 0; i < 12; i++) {
        rstring += characters.charAt(Math.floor(Math.random() * charactersLength));
      }

      
      entry = await strapi.service("api::sign-up.sign-up").create({
        data: {
          accessCode: rstring,
          email: data?.email?.toLowerCase(),
        },
      });
    } catch (error) {
      console.log("user sign up creation error", error);
    }

    if (!entry) {
      entry = await strapi.db
        .query("api::sign-up.sign-up")
        .findOne({ where: { email: data.email.toLowerCase() } });

       if (!entry) {
        return (ctx.body = { message: "Please enter a valid email id" });
      }
    }
  
    const userObj = await this.registerUser(ctx,data.email.toLowerCase());
    console.log("userobj", userObj);

    userslug = userObj?.user?.slug || null;
     
    console.log("userslug", userslug);
    emailnotification.send("sign-in", {
      link: userslug ? "https://postcard.travel/experiences/?access_code=" + entry.accessCode : 
      "https://postcard.travel?access_code=" + entry.accessCode ,
      emailTo: data.email.toLowerCase(),
    });

    return (ctx.body = {
      message:
        "A link to sign in has been sent to " +
        data.email.toLowerCase() +
        " .\n Can't find it? Check your spam folder",
    });
  },

  async validate(ctx) {
    const data  = ctx.request.body;
    if (data?.access_code) {
      let entry = await strapi.db
        .query("api::sign-up.sign-up")
        .findOne({ where: { access_code: data?.access_code } });
      if (entry) {
        return  await this.registerUser(ctx,entry.email);
      } else {
        return {
          message: "Invalid access code",
        };
      }
    }
    else{
      return ctx.body = "Invalid access code";
      
    }
  },

 
  async getURLMetadata(ctx){
    const links  = ctx.request.body;
    
    if(!links) return [];
    let articles = links;
    for (let i = 0; i < links.length; i++) {
      let article = links[i];
      if (article) {
        try {
          const urlMD = await urlMetadata(article.link);
          if (urlMD) {
            articles[i].title = urlMD.title;
            articles[i].description = urlMD.description;
            articles[i].image = urlMD.image;
            // articles[i].link = article.link;
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    return articles;
    
  }
  
}));
