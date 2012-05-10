(ns caribou.admin.templates
  (:use [hiccup core]))


(def templates

  {

    :global
    { :navigation
      { :breadcrumb
        (html
          [:a
            { :href        "#"
              :data-action "{{ action }}" }
            "{{ label }}"]
          [:span.breadcrumb_sep "/"])}}


    :tools
    { :action-item (html [:a {:href "#"} "{{ label }}"])}


    :form
    { :fields
      { :boolean
        (html
          [:label
            { :for "{{ modelSlug }}_{{ fieldSlug }}" }
            [:input
              { :type   "checkbox"
                :id     "{{ modelSlug }}_{{ fieldSlug }}"
                :name   "{{ modelSlug }}[{{ fieldSlug }}]"
                :value  "true" }
            "{{ fieldName }}"]])


        :string
        (html
          [:label
            { :for "{{ modelSlug }}_{{ fieldSlug }}" }
            "{{ fieldName }}<abbr title=\"required\">*</abbr>"]
          [:input
            { :type      "text"
              :id        "{{ modelSlug }}_{{ fieldSlug }}"
              :name      "{{ modelSlug }}[{{ fieldSlug }}]"
              :maxlength "255"
              :value     "{{ value }}" }])


        :slug
        (html
          [:label
            { :for "{{ modelSlug }}_{{ fieldSlug }}" }
            "{{ fieldName }}<abbr title=\"required\">*</abbr>"]
          [:input
            { :type   "text"
              :name   "{{ modelSlug }}[{{ fieldSlug }}]"
              :value  "{{ value }}" }])


        :integer
        (html
          [:label
            { :for "{{ modelSlug }}_{{ fieldSlug }}" }
            "{{ fieldName }}<abbr title=\"required\">*</abbr>"]
          [:input
            { :type   "text"
              :name   "{{ modelSlug }}[{{ fieldSlug }}]"
              :value  "{{ value }}" }])


        :decimal
        (html
          [:label
            { :for "{{ modelSlug }}_{{ fieldSlug }}" }
            "{{ fieldName }}<abbr title=\"required\">*</abbr>"]
            [:input
              { :type   "text"
                :name   "{{ modelSlug }}[{{ fieldSlug }}]"
                :value  "{{ value }}" }])


        :text
        (html
          [:label
            { :for "{{ modelSlug }}_{{ fieldSlug }}" }
            "{{ fieldName }}<abbr title=\"required\">*</abbr>"]
          [:textarea
            { :type "text"
              :name "{{ modelSlug }}[{{ fieldSlug }}]" } "{{ value }}" ])


        :timestamp
        (html
          [:label
            { :for "{{ modelSlug }}_{{ fieldSlug }}" }
            "{{ fieldName }}<abbr title=\"required\">*</abbr>"]
          [:input
            { :type   "text"
              :name   "{{ modelSlug }}[{{ fieldSlug }}]"
              :value  "{{ value }}" }])


        :address
        (html
          [:input
            { :type "hidden"
              :name "{{ modelSlug }}[{{ fieldSlug }}]"}]

          [:label
            { :for "{{ modelSlug }}_{{ fieldSlug }}" }
            "{{ fieldName }}<abbr title=\"required\">*</abbr>"]

          [:input
            { :type   "text"
              :name   "{{ modelSlug }}[{{ fieldSlug }}][address]"
              :value  "{{ value }}" }]

          [:input
            { :type   "text"
              :name   "{{ modelSlug }}[{{ fieldSlug }}][address_two]"
              :value  "{{ value }}" }]

          [:input
            { :type   "text"
              :name   "{{ modelSlug }}[{{ fieldSlug }}][city]"
              :value  "{{ value }}" }]

          [:input
            { :type   "text"
              :name   "{{ modelSlug }}[{{ fieldSlug }}][state]"
              :value  "{{ value }}" }]

          [:input
            { :type   "text"
              :name   "{{ modelSlug }}[{{ fieldSlug }}][postal_code]"
              :value  "{{ value }}" }]

          [:input
            { :type   "text"
              :name   "{{ modelSlug }}[{{ fieldSlug }}][country]"
              :value  "{{ value }}" }])


        :part
        (html
          [:label
            { :for "{{ modelSlug }}_{{ fieldSlug }}" }
            "{{ fieldName }}<abbr title=\"required\">*</abbr>"]
          [:textarea
            { :type "text"
              :name "{{ modelSlug }}[{{ fieldSlug }}]" } "{{ value }}" ])


        :link
        (html
          [:label
            { :for "{{ modelSlug }}_{{ fieldSlug }}" }
            "{{ fieldName }}<abbr title=\"required\">*</abbr>"]
          [:textarea
            { :type "text"
              :name "{{ modelSlug }}[{{ fieldSlug }}]" } "{{ value }}" ])


        :asset
        (html
          [:div
            [:label.fileinput-buttons
              { :for "{{ modelSlug }}_{{ fieldSlug }}" }
              [:span "{{ fieldName }}"]]

            [:input
              { :type   "hidden"
                :name   "{{ modelSlug }}[{{ fieldSlug }}]"
                :value  "{{ value }}" }]

            [:span.update
              { :data-slug "{{ fieldSlug }}" }
              "Choose Asset"]
            [:span#_thumbnail]])}}



    :generic-model
    { :list
      { :main
        (html
          [:div#main_content
            [:div.paginated_collection
              [:div.paginated_collection_contents
                [:div.index_content
                  [:div.index_as_table
                    [:table.index_table {:border 0 :cellspacing 0 :cellpadding 0}
                      [:thead
                        [:tr
                          ;; ------------------------------
                          ;; Header columns populated by js
                          ;; ------------------------------
                          ]]
                      [:tbody
                        ;; --------------------
                        ;; Rows populated by js
                        ;; --------------------
                        ]]]]]]])

        :footer
        (html
          [:nav.pagination
            ;; --------------------------
            ;; Navigation populated by js
            ;; --------------------------
            ]
          [:div.pagination_information
            "Displaying {{ viewLabel }} <b>{{ rangeStart }} - {{ rangeEnd }}</b> "
            "of <b>{{ totalItems }}</b> in total"]
          [:div.download_links
            "Download: "
            [:a
              { :href "{{ csvUrl }}" }
              "CSV"]
            "&nbsp;"
            [:a
              { :href "{{ xmlUrl }}" }
              "XML"]
            "&nbsp;"
            [:a
              { :href "{{ jsonUrl }}" }
              "JSON"]])


        :scopes
        (html
          [:ul.scopes.table_tools_segmented_control
            [:li.scope.all.selected
              [:a.table_tools_button
                { :href "#" }
                "All"
                [:span.count "{{ count }}"]]]])


        :sidebar
        (html
          [:div#sidebar
            ;{{tmpl({viewSpec: viewSpec, viewData: viewData}) \"#sidebarForGenericList\"}}\""}})
            ])}


      :view
      { :main
        (html
          [:div#main_content
            ;; ----------------------
            ;; Panels populated by js
            ;; ----------------------
            ]
          [:div#sidebar
            ;; -----------------------
            ;; Sidebar populated by js
            ;; -----------------------
            ])

         :panel
          (html
            [:h3 "{{ objectTitle }}"]
            [:div.panel_contents
              ;; ---------------------
              ;; Table populated by js
              ;; ---------------------
              ])

         :panel-attributes-table
          (html
            [:table
                { :border "0"
                  :cellspacing "0"
                  :cellpadding "0" }
                [:thead
                  [:tr
                    [:th "Name"]
                    [:th "Type"]]]
                [:tbody
                  ;; --------------------
                  ;; Rows populated by js
                  ;; --------------------
                  ]])}


      :edit
      { :main
        (html
          [:div#main_content
            [:form
              { :accept-charset "UTF-8"
                :action "{{ action }}"
                :class "{{ modelType }}"
                :id "{{ modelType }}_edit" }

            ;; Placeholder div, populated by js
            [:div { :style "margin:0;padding:0;display:inline"}]

            ;; -------------------------
            ;; Fieldsets populated by js
            ;; -------------------------

            [:div.panel
              [:h3 "Model Fields"]
              [:div.panel_contents.model_fields_edit_table
                [:input#removed_fields
                  { :type "hidden"
                    :name "{{ modelType }}[removed_fields]" }]
                [:table
                  { :borders "0"
                    :cellspacing "0"
                    :cellpadding "0" }
                  [:thead
                    [:tr
                      [:th "Name"]
                      [:th "Type"]
                      [:th "Options"]
                      [:th "&nbsp;"]
                      [:th "&nbsp;"]]]
                  [:tbody.sortable
                    ;; --------------------
                    ;; Rows populated by js
                    ;; --------------------
                    ]]]]


            [:fieldset.buttons
              [:ol
                [:li.commit.button
                  [:a.button { :href "#" } "{{ action }} {{ label }}"]]
                [:li.cancel
                  [:a { :href "#" } "Cancel"]]]]]])}


     :sidebar
      { :model-details
        (html
          [:div#filters_sidebar_section.panel.sidebar_section
            [:h3 "Model Details"]
            [:div.panel_contents
              [:div
                { :class "attributes_table {{ className }}" }
                [:table
                  { :border "0"
                    :cellspacing "0"
                    :cellpadding "0" }
                  ;; --------------------
                  ;; Rows populated by js
                  ;; --------------------
                  ]]]])

        :editable-fields
        (html
          [:div#fields_sidebar_section.panel.sidebar_section
            [:h3 "Model Builder"]
            [:div.panel_contents
              ;; ----------------------
              ;; Fields populated by js
              ;; ----------------------
              ]])
        }}



   :abstract
   { :edit
      { :main
        (html
          [:div#main_content
            [:form
              { :accept-charset "UTF-8"
                :action "{{ action }}"
                :class "{{ modelType }}"
                :id "{{ modelType }}_edit" }

            ;; Placeholder div, populated by js
            [:div { :style "margin:0;padding:0;display:inline"}]

            ;; -------------------------
            ;; Fieldsets populated by js
            ;; -------------------------


            [:div.panel
              [:h3 "Model Fields"]
              [:div.panel_contents.model_fields_edit_table
                [:input#removed_fields
                  { :type "hidden"
                    :name "{{ modelType }}[removed_fields]" }]
                [:table
                  { :borders "0"
                    :cellspacing "0"
                    :cellpadding "0" }
                  [:thead
                    [:tr
                      [:th "Name"]
                      [:th "Type"]
                      [:th "Options"]
                      [:th "&nbsp;"]
                      [:th "&nbsp;"]]]
                  [:tbody.sortable
                    ;; --------------------
                    ;; Rows populated by js
                    ;; --------------------
                    ]]]]


            [:fieldset.buttons
              [:ol
                [:li.commit.button
                  [:a.button { :href "#" } "{{ action }} {{ label }}"]]
                [:li.cancel
                  [:a { :href "#" } "Cancel"]]]]]])}


     :row-for-model-edit
     (html
       [:td.name
         [:input
           { :type "text"
             :name "model[fields][{{ index }}][name]"
             :value "{{ name }}"
             :class "{{ className }}" }]]

       [:td.type
         [:input
           { :type "hidden"
             :name "model[fields][{{ index }}][type]"
             :value "{{ type }}" }]

         [:input.model_id
           { :type "hidden"
             :name "model[fields][{{ index }}][id]"
             :value "{{ id }}" }]

         [:input.model_position
           { :type "hidden"
             :name "model[fields][{{ index }}][model_position]"
             :value "{{ modelPosition }}" }]

         [:span "{{ fieldType }}"]]
       [:td.options
         ;; -----------------------
         ;; Options populated by js
         ;; -----------------------
         ]
       [:td.options
         [:label
           [:input
             { :type "checkbox"
               :name "model[fields][{{ index }}][required]" }
             "Required field?"]]]
       [:td.actions
         ;; Optional "delete" field inserted with js
         [:a.member_link.handle_link
           { :href "#" }
           "Drag"]])


      :field-options
      { :string
        (html
          [:div.field
            [:label
              "Default value"]
            [:input.slug_options
              { :type "text"
                :name "model[fields][{{ index }}][default_value]" }]]) ;; "value" attribute is set by js

        :boolean
        (html
          [:div.field
            [:label
              "Default value"]
            [:select
              { :name "model[fields][{{ index }}][default_value]" }
              [:option { :value "true" } "true"]      ;; "selected" attribute is set by js
              [:option { :value "false" } "false"]]]) ;; "selected" attribute is set by js

        :link
        (html
          [:div.field
            [:label
              "Linked field"]
            [:select.slug_options
              { :name "model[fields][{{ index }}][link_slug]" }
              ""]])}}})
