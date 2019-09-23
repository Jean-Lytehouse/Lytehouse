#Define and create string builders here

RESPONSE_BODY = """Thank you for applying to attend {event_description}. Your application is being reviewed by our committee and we will get back to you as soon as possible. Included below is a copy of your responses.


{summary}


Kind Regards,
The {event_name} Organising Committee
"""

def build_response_email_greeting(title, firstname, lastname):
    return ('Dear {title} {firstname} {lastname},'.format(title=title, firstname=firstname, lastname=lastname))

def build_response_email_body(event_name, event_description, summary):
    #stringifying the dictionary summary, with linebreaks between question/answer pairs
    stringified_summary = None
    for key, value in summary.iteritems():
        if(stringified_summary is None):
            stringified_summary = '{question}:\n{answer}'.format(question=key, answer=value)
        else:
            stringified_summary = '{current_summary}\n\n{question}:\n{answer}'.format(current_summary=stringified_summary, question=key, answer=value)

    return (RESPONSE_BODY.format(event_description=event_description, event_name=event_name, summary=stringified_summary))
