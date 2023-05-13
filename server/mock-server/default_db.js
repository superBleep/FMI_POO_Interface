let default_db = {
    "users": [
        {
          "user_id": 1,
          "first_name": "Ionescu",
          "last_name": "Vlad",
          "email": "ionescu.vlad@s.unibuc.ro",
          "password": "1234",
          "is_admin": false,
          "github_account": "https://github.com/Nubaz"
        },
        {
          "user_id": 2,
          "first_name": "Popescu",
          "last_name": "Ion",
          "email": "popescu.ion@fmi.unibuc.ro",
          "password": "1234",
          "is_admin": false,
          "github_account": "https://github.com/mcmarius"
        }
      ],
      "professors": [
        {
          "user_id": 2,
          "professor_id": 1,
          "professor_type": "lab"
        }
      ],
      "students": [
        {
          "user_id": 1,
          "student_id": 1,
          "study_year": 2,
          "study_group": "261"
        }
      ],
      "classes": [
        {
          "class_id": 1,
          "name": "POO",
          "description": "Programare Orientată pe Obiecte",
          "study_year": 2
        }
      ],
      "students_professors_classes": [
        {
          "professor_id": 1,
          "student_id": 1,
          "class_id": 1
        }
      ],
      "projects": [
        {
          "project_id": 1,
          "student_id": 1,
          "class_id": 1,
          "name": "Randomizer!",
          "github_link": "https://github.com/Nubaz/Randomizer_Game"
        }
      ]
}

export default default_db;