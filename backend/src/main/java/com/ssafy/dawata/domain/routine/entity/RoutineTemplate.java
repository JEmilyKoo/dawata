package com.ssafy.dawata.domain.routine.entity;

import com.ssafy.dawata.domain.member.entity.Member;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.List;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "routine_template")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RoutineTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @Builder(access = AccessLevel.PRIVATE)
    public RoutineTemplate(String name, Member member) {
        this.name = name;
        this.member = member;
    }

    public static RoutineTemplate createRoutineTemplate(String name, Member member) {
        return RoutineTemplate.builder()
            .name(name)
            .member(member)
            .build();
    }

    public void updateName(String name) {
        this.name = name;
    }

    @OneToMany(mappedBy = "routineTemplate", fetch = FetchType.LAZY)
    private List<RoutineElement> routineElements;
}
