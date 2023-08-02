package com.b210.damda.domain.timecapsule.service;

import com.b210.damda.domain.dto.MainTimecapsuleListDTO;
import com.b210.damda.domain.dto.SaveTimecapsuleListDTO;
import com.b210.damda.domain.dto.Timecapsule.TimecapsuleCreateDTO;
import com.b210.damda.domain.dto.Timecapsule.TimecapsuleDTO;
import com.b210.damda.domain.entity.Timecapsule.CirteriaDay;
import com.b210.damda.domain.entity.Timecapsule.Timecapsule;
import com.b210.damda.domain.entity.Timecapsule.TimecapsuleCard;
import com.b210.damda.domain.entity.Timecapsule.TimecapsuleMapping;
import com.b210.damda.domain.timecapsule.repository.*;
import com.b210.damda.domain.user.repository.UserRepository;
import com.b210.damda.util.exception.CommonException;
import com.b210.damda.util.exception.CustomExceptionStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.*;

@RequiredArgsConstructor
@Service
@Slf4j
public class TimecapsuleServiceImpl implements TimecapsuleService{

    private final TimecapsuleMappingRepository timecapsuleMappingRepository;
    private final TimecapsuleRepository timecapsuleRepository;
    private final TimecapsuleCardRepository timecapsuleCardRepository;
    private final TimecapsuleCriteriaRepository timecapsuleCriteriaRepository;
    private final UserRepository userRepository;
    private final CirteriaDayRepository cirteriaDayRepository;

    private final int MAX_PARTICIOPANT = 10;
    private final Long MAX_FILESIZE = 100L;
    /*
        유저 정보 불러오기
     */
    public Long getUserNo(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        Long userNo = (Long) principal;

        return userNo;
    }

    /*
        타임캡슐 리스트 받아오기
     */
    @Override
    public Map<String,List<TimecapsuleMapping>> getTimecapsuleList(Long userNo){
        List<TimecapsuleMapping> timecapsules = timecapsuleMappingRepository.findByUserUserNo(userNo);

        //타임캡슐이 있는지?
        if(timecapsules.size() < 1){
            throw new CommonException(CustomExceptionStatus.NOT_TIMECAPSULE);
        }
        //진행중인 타임캡슐
        List<TimecapsuleMapping> workTimecapsules = new ArrayList<>();
        //저장된 타임캡슐
        List<TimecapsuleMapping> saveTimecapsules = new ArrayList<>();

        for(TimecapsuleMapping timecapsule : timecapsules){
            //캡슐이 와전히 삭되었거나, 캡슐저장을 삭제한경우 넘어가라
            if(timecapsule.getTimecapsule().getRemoveDate() != null ||
                timecapsule.getDeleteDate() != null) continue;
            if( timecapsule.isSave() == false) workTimecapsules.add(timecapsule);
            else saveTimecapsules.add(timecapsule);
        }

        Map<String,List<TimecapsuleMapping>> allTimecapsuleList = new HashMap<>();
        allTimecapsuleList.put("workTimecapsules", workTimecapsules);
        allTimecapsuleList.put("saveTimecapsules", saveTimecapsules);

        return allTimecapsuleList;
    }

    /*
        메인화면 타임캡슐 리스트 불러오기
     */
    @Override
    public List<MainTimecapsuleListDTO> workTimecapsule() {
        Long userNo = getUserNo();
        log.info(userNo.toString());
        Map<String,List<TimecapsuleMapping>> allTimecapsuleList = getTimecapsuleList(userNo);

        List<TimecapsuleMapping> workTimecapsules = allTimecapsuleList.get("workTimecapsules");

        //진행중인 타임캡슐이 없다면
        if(workTimecapsules.size() < 1){
            throw new CommonException(CustomExceptionStatus.NOT_WORK_TIMECAPSULE);
        }

        List<MainTimecapsuleListDTO> timecapsuleList = new ArrayList<>();
        for(TimecapsuleMapping timecapsule : workTimecapsules){
            MainTimecapsuleListDTO mainTimecapsule = timecapsule.getTimecapsule().toMainTimecapsuleListDTO();
            /*
                오픈조건 검증 로직
             */
            //목표 타임캡슐이라면
            if(mainTimecapsule.getType().equals("GOAL")){
                List<TimecapsuleCard> cards = timecapsuleCardRepository.findByTimecapsuleTimecapsuleNo(mainTimecapsule.getTimecapsuleNo());
                //저장된 타임캡슐값
                mainTimecapsule.setCurCard(cards.size());
                //상태값 설정 (조건 성립)
                if(mainTimecapsule.getGoalCard() <= mainTimecapsule.getCurCard()) mainTimecapsule.setState(true);
            }
            else{
                //날씨 날짜 시간 장소 등의 로직이 들어갈예정
            }
            timecapsuleList.add(mainTimecapsule);
        }

        return timecapsuleList;
    }

    /*
        저장된 타임캡슐 리스트 불러오기
     */
    @Override
    public List<SaveTimecapsuleListDTO> saveTimecapsule(){

        Long userNo = getUserNo();

        Map<String,List<TimecapsuleMapping>> allTimecapsuleList = getTimecapsuleList(userNo);
        List<TimecapsuleMapping> saveTimecapsules = allTimecapsuleList.get("saveTimecapsules");

        //저장된 타임캡슐이 없는경우
        if(saveTimecapsules.size() < 1){
            throw new CommonException(CustomExceptionStatus.NOT_SAVE_TIMECAPSULE);
        }

        /*
            저장된 타임캡슐 DTO 변화 및 타입이 GOAL 이면 OPENDATE 받아온다
         */
        List<SaveTimecapsuleListDTO> saveTimecapsuleList = new ArrayList<>();
        for(TimecapsuleMapping timecapsuleMapping : saveTimecapsules){
            Timecapsule timecapsule = timecapsuleMapping.getTimecapsule();
            SaveTimecapsuleListDTO saveTimecapsule = timecapsule.toSaveTimecapsuleListDTO();
            if(saveTimecapsule.getType().equals("GOAL")) {
                saveTimecapsule.setEndDate(timecapsuleMapping.getOpenDate());
            }
            saveTimecapsuleList.add(saveTimecapsule);
        }

        return saveTimecapsuleList;
    }

    @Override
    public TimecapsuleDTO createTimecapsule(TimecapsuleCreateDTO timecapsuleCreateDTO) {

         //DTO Entitiy 변환
         Timecapsule createTimecapsule = timecapsuleCreateDTO.toEntity();

         //타임캡슐 추가 기본값 세팅
         createTimecapsule.setRegistDate(
                 Timestamp.valueOf(LocalDateTime.now().withSecond(0).withNano(0))
         );
         createTimecapsule.setMaxFileSize(MAX_FILESIZE);
         createTimecapsule.setMaxParticipant(MAX_PARTICIOPANT);
         createTimecapsule.setInviteCode(createKey());
         createTimecapsule.setCapsuleIconNo(new Random().nextInt(10));

         //타임캡슐 저장 후 No값 받아오기
         Timecapsule saveTimecapsule = timecapsuleRepository.save(createTimecapsule);

         //타임캡슐 생성 에러발생
         if(saveTimecapsule.getTimecapsuleNo() == null){
             throw new CommonException(CustomExceptionStatus.CREATE_TIMECAPSULE);
         }

         if(timecapsuleCreateDTO.getType().equals("GOAL")){
             //카드 작성 요일 등록
             if(timecapsuleCreateDTO.getCardInputDay().size() > 0){
                for(String cardDay : timecapsuleCreateDTO.getCardInputDay()){
                    String dayKr = null;
                    if(cardDay.equals("Monday")) dayKr = "월";
                    if(cardDay.equals("Tuesday")) dayKr = "화";
                    if(cardDay.equals("Wednesday")) dayKr = "수";
                    if(cardDay.equals("Thursday")) dayKr = "목";
                    if(cardDay.equals("Friday")) dayKr = "금";
                    if(cardDay.equals("Saturday")) dayKr = "토";
                    if(cardDay.equals("Sunday")) dayKr = "일";

                    CirteriaDay cirteriaDay = new CirteriaDay();
                    cirteriaDay.setTimecapsuleCriteria(saveTimecapsule.getTimecapsuleCriteria());
                    cirteriaDay.setDayEn(cardDay);
                    cirteriaDay.setDayKor(dayKr);
                    CirteriaDay saveCirteriaDay = cirteriaDayRepository.save(cirteriaDay);
                    // 요일 저장 에러 발생
                    if(saveCirteriaDay.getDayNo() == null){
                        throw new CommonException(CustomExceptionStatus.CREATE_CIRTERIADAY);
                    }
                }
             }
         }

         //타임캡슐 유저 맵핑
         Long userNo = getUserNo();
         TimecapsuleMapping timecapsuleMapping = new TimecapsuleMapping();
         timecapsuleMapping.setUser(userRepository.findByUserNo(userNo).orElseThrow(
                 () -> new CommonException(CustomExceptionStatus.NOT_USER)));
         timecapsuleMapping.setTimecapsule(saveTimecapsule);
         timecapsuleMapping.setHost(true);

         // 저장
         TimecapsuleMapping saveMapping = timecapsuleMappingRepository.save(timecapsuleMapping);

         // 저장 에러
         if(saveMapping.getTimecapsuleMappingNo() == null){
             throw new CommonException(CustomExceptionStatus.CREATE_TIMECAPSULEUSERMAPPING);
         }

         // 상세페이지 불러오기 
         // 상세페이지 만들고 리턴해줘야함

        return null;
    }

    public String createKey() {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        int length = 6;
        SecureRandom rnd = new SecureRandom();

        StringBuilder key = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            key.append(characters.charAt(rnd.nextInt(characters.length())));
        }

        return key.toString();
    }


}