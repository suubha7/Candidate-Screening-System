def build_retrieval_query(
    role_name: str,
    matched_skills: list,
    missing_skills: list
):

    query = f"""
    Role: {role_name}

    Candidate strengths:
    {', '.join(matched_skills)}

    Areas to evaluate:
    {', '.join(missing_skills)}
    """

    return query