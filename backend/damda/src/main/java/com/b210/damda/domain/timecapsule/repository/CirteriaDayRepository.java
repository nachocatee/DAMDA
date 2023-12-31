package com.b210.damda.domain.timecapsule.repository;

import com.b210.damda.domain.entity.Timecapsule.CirteriaDay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CirteriaDayRepository extends JpaRepository<CirteriaDay, Long> {
    List<CirteriaDay> findByTimecapsuleCriteriaCriteriaId(Long criteriaId);
}
