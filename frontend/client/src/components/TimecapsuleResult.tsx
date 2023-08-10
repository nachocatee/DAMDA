import React, { useEffect, useMemo, useState } from "react"
import "../index.css"
import tw from "tailwind-styled-components"
import { styled } from "styled-components"
import { useNavigate, useParams } from "react-router"
import { SubHeader } from "./inc/SubHeader"
import axios from "axios"
import { serverUrl } from "../urls"
import { useSelector } from "react-redux"
import { RootState } from "../store/Store"
import "./datePicker.css"
import Modal from "react-modal"
import TimecapsuleResultMembers from "./TimecapsuleResultMembers"
import TimecapsuleResultImages from "./TimecapsuleResultImages"
import TimecapsuleResultRank from "./TimecapsuleResultRank"

const Box = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  justify-content: start;
  align-items: center;
  margin: auto;
  width: 20rem;
  background-color: ${(props) => props.theme.color50};
  border-radius: 50px;
  font-family: "Pretendard";
  margin-top: 150px;
  box-shadow: 0px 4px 4px 4px rgb(0, 0, 0, 0.25);
  color: ${(props) => props.theme.color900};
  min-height: 656px;
  padding: 0px 15px;
`

const Title = styled.div`
  z-index: 1;
  position: absolute;
  top: 0px;
`

const HightLight = styled.div`
  position: absolute;
  width: calc(100% + 10px);
  height: 13px;
  background-color: ${(props) => props.theme.color200};
  top: 18px;
  margin-left: -5px;
`

// const CapsuleImg = styled.div<{ capsuleIcon: string }>`
//   position: absolute;
//   top: -102px;
//   background-image: url(/${(props) => props.theme[props.capsuleIcon]});
//   background-repeat: no-repeat;
//   background-size: cover;
//   width: 204px;
//   height: 204px;
//   filter: drop-shadow(0px 4px 4px rgb(0, 0, 0, 0.4));
// `

// 나중에 위에껄로 쓰면 됨
const CapsuleImg = styled.div`
  position: absolute;
  top: -102px;
  background-repeat: no-repeat;
  background-size: cover;
  width: 204px;
  height: 204px;
  filter: drop-shadow(0px 4px 4px rgb(0, 0, 0, 0.4));
`

const BackBtn = styled.div`
  color: ${(props) => props.theme.color950};
  font-size: 16px;
`

const TimecapsuleResult = function () {
  const { capsuleId } = useParams()
  const token = useSelector((state: RootState) => state.auth.accessToken)
  const navigate = useNavigate()
  const [comp, setComp] = useState("members")
  const [activeComponent, setActiveComponent] = useState("members")

  const handleNavClick = (compName: string) => {
    setActiveComponent(compName)
  }
  return (
    <>
      <Box>
        <CapsuleImg>
          <img src="../../assets/universe/Planet-9.png" alt="dummyimg" />
        </CapsuleImg>
        <>
          <div className="z-0">
            <Title className="text-2xl font-bold mb-1 mt-28">더미 데이터</Title>
            <div className="text-2xl font-bold relative mb-1 mt-28">
              <div className="invisible">더미 데이터</div>
              <HightLight />
            </div>
          </div>

          <div className="flex mb-2 mt-2">
            <Nav
              onClick={() => {
                setComp("members")
                handleNavClick("members")
              }}
              isActive={activeComponent === "members"}
            >
              상세
            </Nav>
            <Nav
              onClick={() => {
                setComp("images")
                handleNavClick("images")
              }}
              isActive={activeComponent === "images"}
            >
              카드
            </Nav>
            <Nav
              onClick={() => {
                setComp("rank")
                handleNavClick("rank")
              }}
              isActive={activeComponent === "rank"}
            >
              순위
            </Nav>
          </div>
          {comp === "members" && <TimecapsuleResultMembers />}
          {comp === "images" && <TimecapsuleResultImages />}
          {comp === "rank" && <TimecapsuleResultRank />}
          <BackBtn
            onClick={() => {
              navigate(-1)
            }}
            className="my-5"
          >
            돌아가기
          </BackBtn>
        </>
      </Box>
    </>
  )
}

const Nav = styled.div<{ isActive: boolean }>`
  position: relative;
  text-decoration: none;
  font-family: "pretendard";
  font-weight: 400;
  color: ${(props) => props.theme.color700};
  transition: color 0.2s;
  display: inline-flex;
  align-items: center;
  width: 80px;
  justify-content: center;

  &::after {
    content: "";
    position: absolute;
    bottom: -5px;
    width: 100%;
    height: 1px;
    background-color: ${(props) => props.theme.color700};
    display: ${(props) => (props.isActive ? "block" : "none")};
  }
`
export default TimecapsuleResult