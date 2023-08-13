package com.b210.damda.domain.timecapsule.repository;

import com.b210.damda.domain.dto.serverSentEvent.friend.UserNameAndImageDTO;
import com.b210.damda.domain.entity.Timecapsule.Timecapsule;
import com.b210.damda.domain.entity.User.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TimeCapsuleSEERepository extends JpaRepository<Timecapsule, Long> {
    //해당 유저의 이름과 이미지 가져오기
    @Query("SELECT new com.b210.damda.domain.dto.serverSentEvent.friend.UserNameAndImageDTO(u.nickname, u.profileImage) From User u Where u.userNo = :userNo")
    UserNameAndImageDTO getUserNameAndImage(@Param("userNo") Long userNo);

    @Query("SELECT t.inviteCode FROM Timecapsule t WHERE t.timecapsuleNo = :timecapsuleNo")
    String getInviteCode(@Param("timecapsuleNo") Long timeCapsuleNo);
}
