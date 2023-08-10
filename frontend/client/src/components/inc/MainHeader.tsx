import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { styled } from "styled-components"
import tw from "tailwind-styled-components"
import Modal from "react-modal"
import { useSelector } from "react-redux"
import { RootState } from "../../store/Store"
import { FriendType } from "../Friend"
import { CapsuleType } from "../MainPage"
import axios from "axios"
import { serverUrl } from "../../urls"

const TextStyle = styled.p`
  font-family: "pretendard";
  font-weight: 300;
  color: ${(props) => props.theme.colorCommon};
  opacity: 80%;
`
const ThemeBtn = styled.div`
  background-image: url(${(props) =>
    props.theme.colorCommon === "black"
      ? "assets/icons/themeBtnD.png"
      : "assets/icons/themeBtnL.png"});
  background-repeat: no-repeat;
  background-size: cover;
  width: 83px;
  height: 30px;
`
const AlermIcon = styled.div`
  background-image: url(${(props) =>
    props.theme.colorCommon === "black"
      ? "assets/icons/alermD.png"
      : "assets/icons/alermL.png"});
  background-repeat: no-repeat;
  background-size: cover;
  width: 25px;
  height: 25px;
`
const MenuIcon = styled.div`
  background-image: url(${(props) =>
    props.theme.colorCommon === "black"
      ? "assets/icons/hamburgerD.png"
      : "assets/icons/hamburgerL.png"});
  background-repeat: no-repeat;
  background-size: cover;
  width: 25px;
  height: 25px;
`
const RefreshIcon = styled.div`
  background-image: url(${(props) =>
    props.theme.colorCommon === "black"
      ? "assets/icons/refreshD.png"
      : "assets/icons/refreshL.png"});
  background-repeat: no-repeat;
  background-size: cover;
  width: 25px;
  height: 25px;
`

const AlertImg = styled.img`
  width: 60px;
  height: 60px;
`

const customStyles = {
  content: {
    top: "20%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    width: "330px",
    border: "0px",
    backgroundColor: "rgba(255,255,255,0)",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
}

const ModalCard = tw.div`
  mt-5 p-3 text-lilac-900 bg-white opacity-80 rounded-3xl shadow-2xl
  inline-flex items-center
  w-72
`

const AlarmFriendComponent = function ({ friend }: { friend: FriendType }) {
  return (
    <ModalCard style={{ fontFamily: "Pretendard", fontWeight: "600" }}>
      <div>
        <AlertImg src={friend.profileImage} alt="defalut" />
      </div>
      <div className="ml-2" style={{ width: "150px" }}>
        <p>
          <span>{friend.nickname}</span>님께서,
        </p>
        <p>친구요청이 왔어요</p>
      </div>
      <div>
        <button>거절</button>
        <button>수락</button>
      </div>
    </ModalCard>
  )
}

const AlarmTimecapsuleComponent = function ({
  timecapsule,
}: {
  timecapsule: CapsuleType
}) {
  return <div></div>
}

export const MainHeader = function () {
  const navigate = useNavigate()
  const [modalOpen, setModalOpen] = useState(false)
  const alarmFriendData = useSelector((state: RootState) => state.alarm.friends)
  const alarmTimecapsuleData = useSelector(
    (state: RootState) => state.alarm.timecapsule
  )
  const token = useSelector((state: RootState) => state.auth.accessToken)

  const handleClose = () => {
    setModalOpen(false)
  }

  const test = () => {
    axios({
      method: "GET",
      url: serverUrl + "sse/test",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => console.log(response))
      .catch((error) => console.error(error))
  }

  return (
    <div>
      <Modal
        isOpen={modalOpen}
        onRequestClose={handleClose}
        style={customStyles}
      >
        <div className="flex justify-end">
          <button onClick={handleClose}>
            <img src="assets/icons/cancel.png" alt="cancel" />
          </button>
        </div>
        <div>
          {alarmFriendData.length === 0 &&
            alarmTimecapsuleData.length === 0 && (
              <ModalCard
                style={{ fontFamily: "Pretendard", fontWeight: "600" }}
              >
                <div>
                  <AlertImg src="assets/icons/popup.png" alt="defalut" />
                </div>
                <div className="ml-2" style={{ width: "150px" }}>
                  <p>받은 알람이 없습니다.</p>
                </div>
              </ModalCard>
            )}
          {alarmFriendData.length !== 0 && (
            <div>
              {alarmFriendData.map((friend: FriendType) => (
                <AlarmFriendComponent key={friend.userNo} friend={friend} />
              ))}
            </div>
          )}
          {alarmTimecapsuleData.length !== 0 && (
            <div>
              {alarmTimecapsuleData.map((timecapsule: CapsuleType) => (
                <AlarmTimecapsuleComponent
                  key={timecapsule.timecapsuleNo}
                  timecapsule={timecapsule}
                />
              ))}
            </div>
          )}
        </div>
      </Modal>
      <div className="w-10/12 m-auto mt-12 flex justify-between">
        <ThemeBtn
          className="flex justify-center items-center w-20 rounded-lg"
          onClick={() => {
            navigate("/selecttheme")
          }}
        />
        <div className="flex items-center">
          <AlermIcon
            className="mr-6"
            onClick={() => {
              setModalOpen(true)
            }}
          />
          <MenuIcon
            onClick={() => {
              navigate("/menu")
            }}
            className="h-6"
          />
        </div>
      </div>
      <div>
        <button className="bg-white" onClick={test}>
          sse 버튼!
        </button>
      </div>
      {/* <div className="flex items-center justify-end mr-8 mt-8">
        <TextStyle className="opacity-80 mr-2">
          날씨, 위치 업데이트 하기
        </TextStyle>
        <RefreshIcon className="h-7" />
      </div> */}
    </div>
  )
}
