package com.ssafy.dawata.domain.club.service;

import java.util.UUID;

public class TeamCodeGenerator {
    public static String generateTeamCode() {
        return UUID.randomUUID().toString().replaceAll("-", "").substring(0, 6);
    }
}
