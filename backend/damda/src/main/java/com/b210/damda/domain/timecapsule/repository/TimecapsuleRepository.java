package com.b210.damda.domain.timecapsule.repository;

import com.b210.damda.domain.entity.Timecapsule.Timecapsule;
import com.b210.damda.domain.entity.Timecapsule.TimecapsuleMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TimecapsuleRepository extends JpaRepository<Timecapsule, Long> {

    @Override
    Optional<Timecapsule> findById (Long timecapsuleNo);

    Timecapsule findByInviteCode(String inviteCode);


}
