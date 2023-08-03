import React, { useEffect, useState } from "react"
import "../index.css"
import tw from "tailwind-styled-components"
import { styled, css } from "styled-components"
import { useNavigate } from "react-router"
import { SubHeader } from "./inc/SubHeader"
import { useSelector } from "react-redux"
import { RootState } from "../store/Store"
import axios from "axios"
import { serverUrl } from "../urls"
import { CapsuleType } from "./MainPage"

<<<<<<< Updated upstream
const calculateProgressPercentage = (startDate: string, endDate: string) => {
  const currentDate = new Date()
  const dateString = currentDate.toISOString().slice(0, 10)
  const total = calculateDateDifference(startDate, endDate)
  const ratio = calculateDateDifference(startDate, dateString)
  return (ratio / total) * 100
}

=======
type CapsuleType = {
  id: number
  type: string
  sDate: string
  eDate: string
  name: string
  imgsrc: string
  curCard: number
  goalCard: number
  state: boolean
  title: string
}

const capsuleList: CapsuleType[] = [
  {
    id: 1,
    type: "classic",
    sDate: "2023-01-01",
    eDate: "2023-06-01",
    name: "클래식1",
    imgsrc: "capsule1",
    curCard: 0,
    goalCard: 0,
    state: true,
    title: "싸피 친구들 타임캡슐",
  },
  {
    id: 3,
    type: "memory",
    sDate: "2023-01-01",
    eDate: "2023-02-30",
    name: "기록1",
    imgsrc: "capsule10",
    curCard: 0,
    goalCard: 0,
    state: true,
    title: "퇴사하고 싶은 사람들",
  },
  {
    id: 4,
    type: "new",
    sDate: "2023-08-04",
    eDate: "2023-06-01",
    name: "클래식1",
    imgsrc: "capsule3",
    curCard: 0,
    goalCard: 0,
    state: false,
    title: "눈올때마다 기록하기",
  },
  {
    id: 2,
    type: "goal",
    sDate: "2023-01-01",
    eDate: "2024-01-01",
    name: "목표1",
    imgsrc: "capsule5",
    curCard: 50,
    goalCard: 100,
    state: false,
    title: "우리 1년 뒤 만나",
  },
]

>>>>>>> Stashed changes
const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${(props) => props.theme.colorCommon};
  font-family: "Pretendard";
`

const Title = tw.div`
    mt-14
    text-xl
    font-normal
`

const Card = styled.div`
  display: flex;
  width: 318px;
  height: 126px;
  background-color: rgba(251, 248, 252, 0.1);
  border-radius: 30px;
  margin-top: 30px;
  align-items: center;
`

const OpenableCard = styled(Card)`
  box-shadow: 0px 0px 8px 8px rgb(255, 245, 224, 0.5);
`

const UnregisteredCard = styled(Card)`
  background-color: rgb(0, 0, 0, 0.3);
`

const CapsuleState = styled.div`
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const CapsuleTitle = styled.div`
  width: 165px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  word-break: break-all;
`

const CapsuleImg = styled.div<{ capsulenum: string }>`
  position: relative;
  background-image: url(${(props) =>
    props.theme["capsule" + props.capsulenum]});
  background-repeat: no-repeat;
  background-size: cover;
  width: 87px;
  height: 87px;
  margin-left: 20px;
`

const DateDiv = styled.div`
  color: ${(props) => props.theme.colorCommon};
`
const TimecapsulePage = function () {
  // const [capsuleList, setCapsuleList] = useState<CapsuleType[]>([])
  const navigate = useNavigate()

  const capsuleList = useSelector(
    (state: RootState) => state.timecapsule.timecapsules
  )

  console.log(capsuleList)

  return (
    <>
      <SubHeader />
      <Box>
        <Title>진행 중인 타임캡슐</Title>
        {capsuleList.map((capsule) => (
<<<<<<< Updated upstream
          <React.Fragment key={capsule.timecapsuleNo}>
            <Card
              onClick={() => {
                navigate(`/timecapsule/detail/${capsule.timecapsuleNo}`)
              }}
            >
              <CapsuleImg capsulenum={capsule.capsuleIconNo} />
              <div style={{ marginLeft: "15px" }}>
                <CapsuleState>
                  {calculateDday(capsule.eDate)}
                  <DateDiv
                    className="text-sm font-thin"
                    style={{ opacity: "56%" }}
                  >
                    {capsule.eDate}
                  </DateDiv>
                </CapsuleState>
                <CapsuleTitle className="text-xl font-thin">
                  {capsule.name}
                </CapsuleTitle>
              </div>
            </Card>
            {calculateProgressPercentage(capsule.sDate, capsule.eDate) >=
              100 && (
              <OpenableCard
                onClick={() => {
                  navigate(`/timecapsule/detail/${capsule.timecapsuleNo}`)
                }}
              >
                <CapsuleImg capsulenum={capsule.capsuleIconNo} />
                <div style={{ marginLeft: "15px" }}>
                  <CapsuleState>
                    오픈가능
                    <DateDiv
                      className="text-sm font-thin"
                      style={{ opacity: "56%" }}
                    >
                      {capsule.eDate}
                    </DateDiv>
                  </CapsuleState>
                  <CapsuleTitle className="text-xl font-thin">
                    {capsule.name}
                  </CapsuleTitle>
                </div>
              </OpenableCard>
            )}
            {capsule.type === "new" && (
              // 24시간 내의 타임캡슐인 경우
              <UnregisteredCard
                onClick={() => {
                  navigate(`/timecapsule/detail/${capsule.timecapsuleNo}`)
                }}
              >
                <CapsuleImg capsulenum={capsule.capsuleIconNo} />
                <div style={{ marginLeft: "15px" }}>
                  <CapsuleState>
                    등록 전
                    <DateDiv
                      className="text-sm font-thin"
                      style={{ opacity: "56%" }}
                    >
                      {capsule.eDate}
                    </DateDiv>
                  </CapsuleState>
                  <CapsuleTitle className="text-xl font-thin">
                    {capsule.name}
                  </CapsuleTitle>
                </div>
              </UnregisteredCard>
            )}
            {/* {capsule.state === "openable" ? (
=======
          <React.Fragment key={capsule.id}>
            {capsule.state ? (
>>>>>>> Stashed changes
              <OpenableCard>
                <CapsuleImg capsuleNum={capsule.imgsrc} />
                <div style={{ marginLeft: "15px" }}>
                  <CapsuleState>
                    오픈가능
                    <DateDiv
                      className="text-sm font-thin"
                      style={{ opacity: "56%" }}
                    >
                      {capsule.eDate}
                    </DateDiv>
                  </CapsuleState>
                  <CapsuleTitle className="text-xl font-thin">
                    {capsule.title}
                  </CapsuleTitle>
                </div>
              </OpenableCard>
            ) : dataCheck(capsule.sDate) ? (
              <UnregisteredCard>
                <CapsuleImg capsuleNum={capsule.imgsrc} />
                <div style={{ marginLeft: "15px" }}>
                  <CapsuleState>
                    등록 전
                    <DateDiv
                      className="text-sm font-thin"
                      style={{ opacity: "56%" }}
                    >
                      {capsule.eDate}
                    </DateDiv>
                  </CapsuleState>
                  <CapsuleTitle className="text-xl font-thin">
                    {capsule.title}
                  </CapsuleTitle>
                </div>
              </UnregisteredCard>
            ) : (
              <Card>
                <CapsuleImg capsuleNum={capsule.imgsrc} />
                <div style={{ marginLeft: "15px" }}>
                  <CapsuleState>
                    {calculateDday(capsule.eDate)}
                    <DateDiv
                      className="text-sm font-thin"
                      style={{ opacity: "56%" }}
                    >
                      {capsule.eDate}
                    </DateDiv>
                  </CapsuleState>
                  <CapsuleTitle className="text-xl font-thin">
                    {capsule.title}
                  </CapsuleTitle>
                </div>
              </Card>
            )} */}
          </React.Fragment>
        ))}
      </Box>
    </>
  )
}
const dataCheck = (startDate: string): boolean => {
  if (startDate) {
    const targetDate = new Date(startDate)
    const nowDate = new Date()
    const diffDate = nowDate.getTime() - targetDate.getTime()
    if (diffDate < 0) {
      return true
    }
  }
  return false
}

const calculateDday = (endDate: string) => {
  const currentDate = new Date()
  const dateString = currentDate.toISOString().slice(0, 10)

  const dday = calculateDateDifference(dateString, endDate)

  let ddayPrint = ""
  if (dday <= 0) {
    ddayPrint = "D - DAY"
  } else {
    ddayPrint = "D - " + dday
  }
  return ddayPrint
}

const calculateDateDifference = (startDate: string, endDate: string) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const differenceInTime = end.getTime() - start.getTime()
  const differenceInDays = differenceInTime / (1000 * 3600 * 24) // Convert milliseconds to days
  return differenceInDays
}

export default TimecapsulePage
