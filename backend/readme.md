## Fixes Needed

### Chat Group Create API (Teacher)
**Issue**: The `GroupCreate` endpoint returns a 400 Bad Request.
**Causes**:
1.  **Serializer Input Mismatch**: The frontend sends `group_class` as an ID (e.g., `1`), but the serializer expects a full nested object because `group_class = ClassSerializer()`.
2.  **M2M Field Error**: The `create` method attempts to set the `members` ManyToMany field *before* the `Group` instance is saved to the database.

**Solution**:
1.  **Update Serializer**:
    *   Keep `group_class = ClassSerializer(read_only=True)` for reading.
    *   Add `group_class_id = serializers.PrimaryKeyRelatedField(write_only=True, ...)` for writing.
2.  **Fix Create Method**:
    *   Create the `Group` instance first using `group_class_id`.
    *   Add members (creator + students) *after* the instance is created. 
