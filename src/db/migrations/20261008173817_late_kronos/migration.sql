CREATE OR REPLACE FUNCTION app.create_default_user_project()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO "app"."project" (
        "name",
        "description",
        "is_primary",
        "icon_id",
        "user_id"
    )
    VALUES (
        NEW.name || '''s Project',  
        '',
        TRUE,                            
        'folder',
        NEW.id                            
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_default_project
AFTER INSERT ON "auth"."user"
FOR EACH ROW
EXECUTE FUNCTION app.create_default_user_project();