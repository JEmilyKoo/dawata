package com.ssafy.dawata.domain.feed.entity;


import com.ssafy.dawata.domain.appointment.entity.Appointment;
import com.ssafy.dawata.domain.common.entity.BaseTimeEntity;
import jakarta.persistence.CascadeType;
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
import java.util.ArrayList;
import java.util.List;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "feed")
public class Feed extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String content;

    @Column(nullable = false)
    private String written;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id", nullable = false)
    private Appointment appointment;

    @OneToMany(mappedBy = "feed", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TagMember> tagMembers = new ArrayList<>();

    @Builder(access = AccessLevel.PRIVATE)
    public Feed(String content, String written, Appointment appointment) {
        this.content = content;
        this.written = written;
        this.appointment = appointment;
    }

    public static Feed create(String content, String written, Appointment appointment) {
        return Feed.builder()
            .content(content)
            .written(written)
            .appointment(appointment)
            .build();
    }

    public void updateContent(String content) {
        this.content = content;
    }

    public void addTagMember(TagMember tagMember) {
        tagMembers.add(tagMember);
        tagMember.setFeed(this);
    }

    public void removeTagMember(TagMember tagMember) {
        tagMembers.remove(tagMember);
        tagMember.setFeed(null);
    }

}
