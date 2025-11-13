"use strict";


module.exports = {
  async send(messageType,data) {
    let templateId = 0;
    switch (messageType) {

      case "postcard-titles-review":
        templateId = 2;
        break;
      case "postcard-stories-review":
          templateId = 3;
          break;

      case "sign-in":
        templateId = 1;
        break;
      case "welcome":
        templateId=4;
        break;
    case "contactus":
        templateId=4;
        break;
    case "storyteller-application":
        templateId=5;
        break;
    case "new-user-signup":
        templateId=6;
        break;
      case "article-review":
        templateId=8;
        break;
      case "article-approve":
        templateId=11;
        break;
       case "article-publish":
        templateId=13;
        break;
      case "article-reject":
        templateId=9;
        break;
    }



    let emailTo = data?.emailTo || "amit@postcard.travel";
    // let emailTo = "sanjay@tpix.in";
    // if(messageType==="welcome"){
    //      emailTo = data.email;
    // }
    // else if(messageType == "influencersignup" || messageType == "withdrawal")
    //     emailTo = emailList;


    try {

        await strapi.plugins['email-designer'].services.email.sendTemplatedEmail(
          {
            // required
            to: emailTo,
            // optional array of files
            attachments: [],
          },
          {
            // required - Ref ID defined in the template designer (won't change on import)
            templateReferenceId: templateId,

            // If provided here will override the template's subject.
            // Can include variables like `Thank you for your order {{= USER.firstName }}!`
            // subject: `Thank you`,
          },
          {
            // this object must include all variables you're using in your email template
            data: data,
          }
        );
        console.log("email sent", data);
    } catch (err) {
      strapi.log.debug("📺: ", err);
      return err;
    }
    console.log("email sent");
    return "email send";
  },
};
