def compare_skills(candidate_skills, role_skills):

    candidate_set = set(
        skill.strip().lower()
        for skill in candidate_skills
    )

    role_set = set(
        skill.strip().lower()
        for skill in role_skills
    )

    matched_skills = list(candidate_set & role_set)

    missing_skills = list(role_set - candidate_set)

    return {
        "matched_skills": matched_skills,
        "missing_skills": missing_skills
    }