import { useState } from "react";
import { FlexBox } from "../../styles/Layout/FlexBox";
import TabsPart from "../TabsPart";
import TravelPostcardList from "../TravelExplore/TravelPostcardList";
import PostcardModal from "../PostcardModal";
import ModalShare from "../ModalShare";
// import ModalSignupLogin from "../ModalSignupLogin";
import CollectionPanel from "../TravelExpertsDetail/TravelExpertsDetailContainer/CollectionPanel";
import SignUpInModal from "../HomePage1/SignUpInModal";
import SignUpInfoModal from "../HomePage1/SignUpInfoModal";
const DataDisplayContainer = ({
    pages,
    postcards,
    pageProfile,
    refetch,
    defaultTab
}) => {
    const [shareData, setShareData] = useState(null);
    const [showShareModal, setShowShareModal] = useState(false);
    const [loginModal, setLoginModal] = useState({ mode: "", isShow: false });
    const [showSignModal, setShowSignModal] = useState({
        isShow: false,
        title: "",
        message: ""
    });

    const tabData =
        postcards && postcards.length > 0 && pages && pages.length > 0
            ? [
                  {
                      name: "Experiences",
                      childComp: (
                          <TravelPostcardList
                              postcards={postcards}
                              isHomePage={true}
                              canEdit={true}
                              refetch={refetch}
                              handlePublish={refetch}
                              onShareClick={(shareData) => {
                                  setShareData({
                                      ...shareData
                                  });
                                  setShowShareModal(true);
                              }}
                          />
                      )
                  },
                  {
                      name: "Pages",
                      childComp: (
                          <CollectionPanel
                              pageProfile={pageProfile}
                              stories={pages}
                              refetch={refetch}
                          />
                      )
                  }
              ]
            : postcards && postcards.length === 0 && pages && pages.length > 0
            ? [
                  {
                      name: "Pages",
                      childComp: (
                          <CollectionPanel
                              pageProfile={pageProfile}
                              stories={pages}
                              refetch={refetch}
                          />
                      )
                  }
              ]
            : postcards && postcards.length > 0 && pages && pages.length === 0
            ? [
                  {
                      name: "Experiences",
                      childComp: (
                          <TravelPostcardList
                              postcards={postcards}
                              isHomePage={true}
                              canEdit={true}
                              refetch={refetch}
                              handlePublish={refetch}
                              onShareClick={(shareData) => {
                                  setShareData({
                                      ...shareData
                                  });
                                  setShowShareModal(true);
                              }}
                          />
                      )
                  }
              ]
            : [
                  {
                      name: "Experiences",
                      childComp: (
                          <TravelPostcardList
                              postcards={postcards}
                              isHomePage={true}
                              canEdit={true}
                              refetch={refetch}
                              handlePublish={refetch}
                              onShareClick={(shareData) => {
                                  setShareData({
                                      ...shareData
                                  });
                                  setShowShareModal(true);
                              }}
                          />
                      )
                  },
                  {
                      name: "Pages",
                      childComp: (
                          <CollectionPanel
                              pageProfile={pageProfile}
                              stories={pages}
                              refetch={refetch}
                          />
                      )
                  }
              ];
    return (
        <FlexBox variant="homePage" mt="3em">
            <TabsPart defaultTab={defaultTab} tabData={tabData} />

            <PostcardModal
                isShow={showShareModal}
                headerText="Share"
                children={
                    <ModalShare
                        handleClose={() => setShowShareModal(false)}
                        {...shareData}
                    />
                }
                handleClose={() => setShowShareModal(false)}
            />
            {/* <PostcardModal
                isShow={loginModal.isShow}
                headerText={
                    loginModal.mode === "login" ? "Sign in" : "Free Sign Up!"
                }
                size={loginModal.mode === "login" ? "xl" : "sm"}
                children={
                    <ModalSignupLogin
                        mode={loginModal.mode}
                        toggleMode={() =>
                            setLoginModal({
                                isShow: true,
                                mode:
                                    loginModal.mode === "login"
                                        ? "signup"
                                        : "login"
                            })
                        }
                        handleClose={() => {
                            setLoginModal({ isShow: false });
                        }}
                    />
                }
                handleClose={() => {
                    setLoginModal({ isShow: false });
                }}
            /> */}
            <SignUpInModal
                isShow={loginModal.isShow}
                mode={loginModal.mode}
                setShowModal={setLoginModal}
                setShowSignModal={setShowSignModal}
            />
            <SignUpInfoModal
                state={showSignModal}
                setShowSignModal={setShowSignModal}
            />
        </FlexBox>
    );
};
export default DataDisplayContainer;
