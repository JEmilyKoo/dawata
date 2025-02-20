export const dummyAppointmentList = [
  {
    clubInfo: {
      clubId: 1,
      name: 'Tech Innovators',
      img: 'path/to/image1.png',
      category: 'Technology',
    },
    appointmentInfo: {
      appointmentId: 101,
      name: 'Weekly Sync',
      category: 'Meeting',
      scheduledAt: '2025-03-15T10:00:00Z',
      voteEndTime: '2025-03-14T12:00:00Z',
    },
    participantInfos: [
      {
        email: 'user1@example.com',
        isAttending: true,
        dailyStatus: 'On Time',
      },
      {
        email: 'user2@example.com',
        isAttending: false,
        dailyStatus: 'Absent',
      },
    ],
    voteStatus: 'SELECTED',
  },
  {
    clubInfo: {
      clubId: 2,
      name: 'Fitness Gurus',
      img: 'path/to/image2.png',
      category: 'Fitness',
    },
    appointmentInfo: {
      appointmentId: 102,
      name: 'Morning Yoga',
      category: 'Exercise',
      scheduledAt: '2025-03-16T06:30:00Z',
      voteEndTime: '2025-03-15T20:00:00Z',
    },
    participantInfos: [
      {
        email: 'user3@example.com',
        isAttending: true,
        dailyStatus: 'Late',
      },
    ],
    voteStatus: 'NOT_PARTICIPANT',
  },
  {
    clubInfo: {
      clubId: 3,
      name: 'Book Lovers',
      img: 'path/to/image3.png',
      category: 'Reading',
    },
    appointmentInfo: {
      appointmentId: 103,
      name: 'Monthly Book Club',
      category: 'Discussion',
      scheduledAt: '2025-03-20T18:00:00Z',
      voteEndTime: '2025-03-19T22:00:00Z',
    },
    participantInfos: [
      {
        email: 'user4@example.com',
        isAttending: false,
        dailyStatus: 'Absent',
      },
      {
        email: 'user5@example.com',
        isAttending: true,
        dailyStatus: 'On Time',
      },
    ],
    voteStatus: 'EXPIRED',
  },
  {
    clubInfo: {
      clubId: 4,
      name: 'Gaming Zone',
      img: 'path/to/image4.png',
      category: 'Gaming',
    },
    appointmentInfo: {
      appointmentId: 104,
      name: 'Weekend Tournament',
      category: 'Competition',
      scheduledAt: '2025-03-22T14:00:00Z',
      voteEndTime: '2025-03-21T18:00:00Z',
    },
    participantInfos: [
      {
        email: 'user6@example.com',
        isAttending: true,
        dailyStatus: 'On Time',
      },
    ],
    voteStatus: 'NOT_SELECTED',
  },
  {
    clubInfo: {
      clubId: 5,
      name: 'Coding Enthusiasts',
      img: 'path/to/image5.png',
      category: 'Programming',
    },
    appointmentInfo: {
      appointmentId: 105,
      name: 'Hackathon Prep',
      category: 'Workshop',
      scheduledAt: '2025-03-18T09:00:00Z',
      voteEndTime: '2025-03-17T23:59:00Z',
    },
    participantInfos: [
      {
        email: 'user7@example.com',
        isAttending: false,
        dailyStatus: 'Absent',
      },
      {
        email: 'user8@example.com',
        isAttending: true,
        dailyStatus: 'Late',
      },
    ],
    voteStatus: 'SELECTED',
  },
  {
    clubInfo: {
      clubId: 6,
      name: 'Foodies United',
      img: 'path/to/image6.png',
      category: 'Culinary',
    },
    appointmentInfo: {
      appointmentId: 106,
      name: 'Cooking Class',
      category: 'Learning',
      scheduledAt: '2025-03-25T17:00:00Z',
      voteEndTime: '2025-03-24T20:00:00Z',
    },
    participantInfos: [
      {
        email: 'user9@example.com',
        isAttending: true,
        dailyStatus: 'On Time',
      },
    ],
    voteStatus: 'EXPIRED',
  },
  {
    clubInfo: {
      clubId: 7,
      name: 'Photography Club',
      img: 'path/to/image7.png',
      category: 'Photography',
    },
    appointmentInfo: {
      appointmentId: 107,
      name: 'Sunset Photo Walk',
      category: 'Outdoor Activity',
      scheduledAt: '2025-03-26T18:30:00Z',
      voteEndTime: '2025-03-25T22:00:00Z',
    },
    participantInfos: [
      {
        email: 'user10@example.com',
        isAttending: true,
        dailyStatus: 'On Time',
      },
      {
        email: 'user11@example.com',
        isAttending: false,
        dailyStatus: 'Absent',
      },
    ],
    voteStatus: 'NOT_PARTICIPANT',
  },
  {
    clubInfo: {
      clubId: 8,
      name: 'Music Band',
      img: 'path/to/image8.png',
      category: 'Music',
    },
    appointmentInfo: {
      appointmentId: 108,
      name: 'Band Practice',
      category: 'Rehearsal',
      scheduledAt: '2025-03-28T16:00:00Z',
      voteEndTime: '2025-03-27T20:00:00Z',
    },
    participantInfos: [
      {
        email: 'user12@example.com',
        isAttending: true,
        dailyStatus: 'Late',
      },
    ],
    voteStatus: 'NOT_SELECTED',
  },
  {
    clubInfo: {
      clubId: 9,
      name: 'Movie Buffs',
      img: 'path/to/image9.png',
      category: 'Entertainment',
    },
    appointmentInfo: {
      appointmentId: 109,
      name: 'Movie Night',
      category: 'Leisure',
      scheduledAt: '2025-03-29T19:30:00Z',
      voteEndTime: '2025-03-28T22:00:00Z',
    },
    participantInfos: [
      {
        email: 'user13@example.com',
        isAttending: false,
        dailyStatus: 'Absent',
      },
      {
        email: 'user14@example.com',
        isAttending: true,
        dailyStatus: 'On Time',
      },
    ],
    voteStatus: 'SELECTED',
  },
  {
    clubInfo: {
      clubId: 10,
      name: 'Volunteer Group',
      img: 'path/to/image10.png',
      category: 'Community Service',
    },
    appointmentInfo: {
      appointmentId: 110,
      name: 'Beach Cleanup',
      category: 'Social Work',
      scheduledAt: '2025-03-30T08:00:00Z',
      voteEndTime: '2025-03-29T18:00:00Z',
    },
    participantInfos: [
      {
        email: 'user15@example.com',
        isAttending: true,
        dailyStatus: 'On Time',
      },
    ],
    voteStatus: 'EXPIRED',
  },
]
export default dummyAppointmentList
