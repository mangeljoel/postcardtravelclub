
module.exports = ({ strapi }) => ({
  async index(ctx) {
    try {
      const event = ctx?.request?.body;

      switch (event?.type) {
        case "form_response": {
          const payload = event.form_response?.answers;
          
         console.log("answers " + payload)

          if (payload) {
            
              const newOrder = await strapi.entityService.create(
                "api::lead-type-form.lead-type-form",
                {
                  data: {
                    email: payload[0].email,
                    fullName: payload[1].text,
                    businessName: payload[2].text,
                    website: payload[3].website,
                    founderStory: payload[4].text,
                    businessName: payload[5].text,
                    valueToPostcard: payload[6].text,
                    postcardReason: payload[7].text,
                    partnershipSuccess: payload[8].text,
                    social:
                    {
                      instagram: payload[9].website,
                      facebook: payload[10].website,
                      linkedin: payload[11].website
                   
                  },
                }
              }
              );

             
        }
      }
      break;

       default:
          console.log(
            `WebhooksController.index: Unhandled event type ${event.type}`
          );
      }

      ctx.body = {
        received: true,
      };
    } catch (error) {
      console.error("WebhooksController.index", error);

      ctx.body = {
        received: true,
      };
    }
  },
});
